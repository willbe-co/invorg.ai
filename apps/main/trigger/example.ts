import { logger, task, wait } from "@trigger.dev/sdk/v3";
import { z } from "zod";


type Props = {
  docUrl: string,
  userId: string,
  invoiceId: string
}

export const example = task({
  id: "example",
  maxDuration: 10000,
  run: async (payload: Props, { ctx }) => {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
    myHeaders.append("x-webhook-token", process.env.WEBHOOK_SECRET_TOKEN!)

    await fetch("http://localhost:3000/api/webhooks/test",
      {
        method: "post",
        headers: myHeaders,
        body: JSON.stringify({
          ola: "mundo"
        })
      }
    )

    return {
      message: JSON.stringify({ message: "success" }),
    }
  },
});
