export async function sendPurchaseEmail(to: string, downloadUrl: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Wolf Flow LLC <orders@wolfflowllc.com>",
      to,
      subject: "Your Wolf Flow download is ready",
      text: `Hi,\n\nYour purchase is confirmed. Click the link below to download your file:\n\n${downloadUrl}\n\nThis link expires in 24 hours and allows up to 3 downloads. If you have any issues, reply to this email.\n\n— Wolf Flow LLC`,
    }),
  });
}
