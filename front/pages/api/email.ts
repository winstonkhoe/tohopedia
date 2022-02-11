import { Message, SMTPClient } from "emailjs";

export default async function handler(req: any, res: any) {
    const { email } = req.body;
    console.log("hehe")
  console.log(process.env)

  const client = new SMTPClient({
    user: process.env.mail,
    password: process.env.password,
    host: "smtp.gmail.com",
    ssl: true,
  });

    try {
        console.log("hehe")
        console.log(process.env)
    // const message = await client.sendAsync({
    //   text: `Just for testing purpose`,
    // //   from: "winstonkhoe@gmail.com",
    //   from: process.env.mail,
    //   to: "winstonkhoe@gmail.com",
    //   subject: "testing emailjs",
    // });
  } catch (e) {
    res.status(400).end(JSON.stringify({ message: "Error" }));
    return;
  }

//   res.status(200).end(JSON.stringify({ message: process.env }));
  res.status(200).end(JSON.stringify({ message: "Send Mail" }));
}
