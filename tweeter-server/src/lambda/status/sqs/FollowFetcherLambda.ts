import { StatusDto, UserDto } from "tweeter-shared";
import { FactoryDAODynamo } from "../../../database/dao/dynamo/FactoryDAODynamo";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { FollowService } from "../../../model/service/FollowService";

const sqsClient = new SQSClient();

async function sendMessage(jsonItem: string): Promise<void> {
  const params = {
    QueueUrl:
      "https://sqs.us-east-1.amazonaws.com/940172380290/tweeter-update-feed",
    MessageBody: jsonItem,
  };

  try {
    await sqsClient.send(new SendMessageCommand(params));
    console.log("Successfully sent batch message");
  } catch (err) {
    console.error("Failed to send SQS message:", err);
    throw new Error((err as Error).message);
  }
}

export const handler = async (event: any) => {

  const followService = new FollowService(new FactoryDAODynamo());

  for (const record of event.Records) {
    const status: StatusDto = JSON.parse(record.body);
    const userAlias = status.user.alias;

    let lastFollower: string | null = null;
    let hasMoreFollowers = true;
    let count = 0;

    while (hasMoreFollowers) {
      const [followerAliases, hasMore] =
        await followService.getFollowersForFeedUpdate(
          userAlias,
          100, 
          lastFollower
        );
      count += 100;
      console.log(count);
      console.log("Has More: " + hasMore.toString());

      const message = {
        status: status,
        followers: followerAliases,
      };

      // console.log(
      //   "Message size:",
      //   Buffer.byteLength(JSON.stringify(message), "utf8"),
      //   "bytes"
      // );
      await sendMessage(JSON.stringify(message));

      hasMoreFollowers = hasMore;
      lastFollower =
        followerAliases.length > 0 ? followerAliases[followerAliases.length - 1] : null;
    }
  }

};
