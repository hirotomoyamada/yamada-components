import type { FC } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Heading,
  Text,
  VStack,
} from "@yamada-ui/react"

const HeroWithBackgroundImage: FC = () => {
  return (
    <Container
      bgImage="url(https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
      bgPosition="center"
      bgSize="cover"
      h="full"
      minH="fit-content"
      position="relative"
    >
      <Box bg="blackAlpha.700" inset={0} position="absolute" zIndex="0" />
      <VStack
        as={Center}
        gap="lg"
        h="full"
        p={{ base: "lg", md: "md" }}
        zIndex="1"
      >
        <Heading
          as="h2"
          size="3xl"
          color="white"
          fontWeight={900}
          lineHeight="1.2"
          maxW="xl"
        >
          Automated AI code reviews for any stack
        </Heading>
        <Text color="white" fontSize="xl" maxW="xl">
          Build more reliable software with AI companion. AI is also trained to
          detect lazy developers who do nothing and just complain on Twitter.
        </Text>

        <ButtonGroup gap="md">
          <Button
            as="a"
            href="/getting-started"
            colorScheme="primary"
            rounded="full"
            onClick={(e) => e.preventDefault()}
          >
            Get started
          </Button>
          <Button
            as="a"
            href="https://yamada-ui.com"
            colorScheme="primary"
            variant="outline"
            rounded="full"
            onClick={(e) => e.preventDefault()}
          >
            Live demo
          </Button>
        </ButtonGroup>
      </VStack>
    </Container>
  )
}

export default HeroWithBackgroundImage
