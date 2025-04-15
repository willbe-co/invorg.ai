import { z } from "zod";

// Email address object schema
const emailFullSchema = z.object({
  Email: z.string().email(),
  Name: z.string(),
  MailboxHash: z.string()
});

// Header item schema
const headerSchema = z.object({
  Name: z.string(),
  Value: z.string()
});

// Attachment schema
const attachmentSchema = z.object({
  Name: z.string(),
  Content: z.string(),
  ContentType: z.string(),
  ContentLength: z.number(),
  ContentID: z.string()
});

// Main inbound email schema
export const postmarkInboundEmailSchema = z.object({
  From: z.string(),
  MessageStream: z.string(),
  FromName: z.string(),
  FromFull: emailFullSchema,
  To: z.string(),
  ToFull: z.array(emailFullSchema),
  Cc: z.string().optional(),
  CcFull: z.array(emailFullSchema).optional(),
  Bcc: z.string().optional(),
  BccFull: z.array(emailFullSchema).optional(),
  OriginalRecipient: z.string().optional(),
  ReplyTo: z.string().optional(),
  Subject: z.string(),
  MessageID: z.string(),
  Date: z.string(),
  MailboxHash: z.string().optional(),
  TextBody: z.string(),
  HtmlBody: z.string().optional(),
  StrippedTextReply: z.string().optional(),
  Tag: z.string().optional(),
  Headers: z.array(headerSchema).optional(),
  Attachments: z.array(attachmentSchema).optional()
});

// Type inference
export type PostmarkInboundEmail = z.infer<typeof postmarkInboundEmailSchema>;
