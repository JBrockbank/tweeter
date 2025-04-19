import { TweeterResponse, StatusDto, PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { FactoryDAODynamo } from "../../database/dao/dynamo/FactoryDAODynamo";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

let sqsClient = new SQSClient();

async function sendMessage(jsonItem: string): Promise<void> {
  const sqs_url =
    "https://sqs.us-east-1.amazonaws.com/940172380290/tweeter-post-status";
  const messageBody = jsonItem;
  console.log(sqs_url, messageBody);

  const params = {
    DelaySeconds: 10,
    MessageBody: messageBody,
    QueueUrl: sqs_url,
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
  } catch (err) {
    throw err;
  }
}

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  await new StatusService(new FactoryDAODynamo()).postStatus(
    request.authToken,
    request.newStatus
  );

  const jsonItem = JSON.stringify(request.newStatus);
  await sendMessage(jsonItem);

  return {
    successIndicator: true,
    message: null,
  };
};