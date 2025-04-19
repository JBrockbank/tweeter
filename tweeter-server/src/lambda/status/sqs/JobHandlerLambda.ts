import { FactoryDAODynamo } from "../../../database/dao/dynamo/FactoryDAODynamo";
import { StatusService } from "../../../model/service/StatusService";

export const handler = async (event: any) => {
  for (let i = 0; i < event.Records.length; ++i) {
    const startTimeMillis = new Date().getTime();
    for (let i = 0; i < event.Records.length; ++i) {
      const { body } = event.Records[i];
      const { status: status, followers: followers } = JSON.parse(body);
      console.log(status, followers);
      await new StatusService(new FactoryDAODynamo()).batchPostStatus(
        status,
        followers
      );
      console.log("Batch Post Status Successful!");
    }
    const elapsedTime = new Date().getTime() - startTimeMillis;
    if (elapsedTime < 1000) {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 1000 - elapsedTime)
      );
    }
  }
};
