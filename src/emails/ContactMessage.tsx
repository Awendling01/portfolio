import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  email: string;
  message: string;
};

export default function ContactMessageEmail({ name, email, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`New portfolio message from ${name}`}</Preview>
      <Body
        style={{
          backgroundColor: "#0f172a",
          color: "#cbd5e1",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 12,
            margin: "0 auto",
            maxWidth: 560,
            padding: 28,
          }}
        >
          <Heading
            as="h1"
            style={{
              color: "#f1f5f9",
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              marginBottom: 8,
            }}
          >
            New message from your portfolio
          </Heading>
          <Text style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
            Sent via the andrewwendling.info contact form.
          </Text>

          <Hr
            style={{
              borderColor: "#334155",
              borderTop: "1px solid #334155",
              margin: "20px 0",
            }}
          />

          <Section>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 11,
                letterSpacing: "0.18em",
                margin: 0,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              From
            </Text>
            <Text
              style={{
                color: "#f1f5f9",
                fontSize: 15,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: "#38bdf8",
                fontSize: 14,
                margin: 0,
                marginTop: 2,
              }}
            >
              {email}
            </Text>
          </Section>

          <Hr
            style={{
              borderColor: "#334155",
              borderTop: "1px solid #334155",
              margin: "20px 0",
            }}
          />

          <Section>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 11,
                letterSpacing: "0.18em",
                margin: 0,
                marginBottom: 4,
                textTransform: "uppercase",
              }}
            >
              Message
            </Text>
            <Text
              style={{
                color: "#cbd5e1",
                fontSize: 15,
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
