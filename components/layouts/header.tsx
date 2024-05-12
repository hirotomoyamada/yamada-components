import type {
  CenterProps,
  DrawerProps,
  IconButtonProps,
  MenuProps,
  UseDisclosureReturn,
} from "@yamada-ui/react"
import {
  Box,
  Center,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuOptionItem,
  Spacer,
  VStack,
  forwardRef,
  mergeRefs,
  useBreakpoint,
  useBreakpointValue,
  useDisclosure,
  useMotionValueEvent,
  useScroll,
} from "@yamada-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import type { FC } from "react"
import { memo, useEffect, useRef, useState } from "react"
import { ColorModeButton, Search, ThemeSchemeButton } from "components/forms"
import {
  Discord,
  Github,
  Hamburger,
  Translate,
} from "components/media-and-icons"
import { NextLinkIconButton } from "components/navigation"
import { CONSTANT } from "constant"
import { useI18n } from "contexts/i18n-context"

export type HeaderProps = CenterProps & {}

export const Header = memo(
  forwardRef<HeaderProps, "div">(({ ...rest }, ref) => {
    const headerRef = useRef<HTMLHeadingElement>()
    const { scrollY } = useScroll()
    const [y, setY] = useState<number>(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { height = 0 } = headerRef.current?.getBoundingClientRect() ?? {}

    useMotionValueEvent(scrollY, "change", setY)

    const isScroll = y > height

    return (
      <>
        <Center
          ref={mergeRefs(ref, headerRef)}
          as="header"
          w="full"
          bg={isScroll ? ["whiteAlpha.500", "blackAlpha.200"] : undefined}
          backdropFilter="auto"
          backdropSaturate="180%"
          backdropBlur="10px"
          shadow={isScroll ? ["base", "dark-sm"] : undefined}
          transitionProperty="common"
          transitionDuration="slower"
          position="sticky"
          top="0"
          left="0"
          right="0"
          zIndex="guldo"
          {...rest}
        >
          <HStack w="full" maxW="9xl" py="3" px={{ base: "lg", md: "md" }}>
            <Box
              as={Link}
              href="/"
              aria-label="Yamada UI"
              _hover={{ opacity: 0.7 }}
              transitionProperty="opacity"
              transitionDuration="slower"
              _focus={{ outline: "none" }}
              _focusVisible={{ boxShadow: "outline" }}
              rounded="md"
            >
              <Heading fontSize="2xl">Yamada Components</Heading>
            </Box>

            <Spacer />

            <Search
              display={{ base: "flex", md: "none" }}
              borderColor={isScroll ? "transparent" : "border"}
            />

            <ButtonGroup {...{ isOpen, onOpen }} />
          </HStack>
        </Center>

        <MobileMenu isOpen={isOpen} onClose={onClose} />
      </>
    )
  }),
)

type ButtonGroupProps = Partial<UseDisclosureReturn> & { isMobile?: boolean }

const ButtonGroup: FC<ButtonGroupProps> = memo(
  ({ isMobile, isOpen, onOpen, onClose }) => {
    return (
      <HStack gap="sm">
        <NextLinkIconButton
          href={CONSTANT.SNS.DISCORD}
          isExternal
          aria-label="GitHub repository"
          variant="ghost"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          color="muted"
          icon={<Discord />}
        />

        <NextLinkIconButton
          href={CONSTANT.SNS.GITHUB.YAMADA_COMPONENTS}
          isExternal
          aria-label="Discord server"
          variant="ghost"
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
          color="muted"
          icon={<Github />}
        />

        <ThemeSchemeButton
          display={{ base: "inline-flex", lg: !isMobile ? "none" : undefined }}
        />

        {CONSTANT.I18N.LOCALES.length > 1 ? (
          <I18nButton
            display={{
              base: "inline-flex",
              md: !isMobile ? "none" : undefined,
            }}
          />
        ) : null}

        <ColorModeButton />

        {!isOpen ? (
          <IconButton
            variant="ghost"
            aria-label="Open navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onOpen}
            icon={<Hamburger />}
          />
        ) : (
          <CloseButton
            size="lg"
            aria-label="Close navigation menu"
            display={{ base: "none", lg: "inline-flex" }}
            color="muted"
            onClick={onClose}
          />
        )}
      </HStack>
    )
  },
)

ButtonGroup.displayName = "ButtonGroup"

type I18nButtonProps = IconButtonProps & {
  menuProps?: MenuProps
}

const I18nButton: FC<I18nButtonProps> = memo(({ menuProps, ...rest }) => {
  const padding = useBreakpointValue({ base: 32, md: 16 })
  const { locale, changeLocale } = useI18n()

  return (
    <Menu
      placement="bottom"
      modifiers={[
        {
          name: "preventOverflow",
          options: {
            padding: {
              top: padding,
              bottom: padding,
              left: padding,
              right: padding,
            },
          },
        },
      ]}
      restoreFocus={false}
      {...menuProps}
    >
      <MenuButton
        as={IconButton}
        aria-label="Open language switching menu"
        variant="ghost"
        color="muted"
        icon={<Translate />}
        {...rest}
      />

      <MenuList>
        <MenuOptionGroup<string>
          value={locale}
          onChange={changeLocale}
          type="radio"
        >
          {CONSTANT.I18N.LOCALES.map(({ label, value }) => (
            <MenuOptionItem key={value} value={value} closeOnSelect>
              {label}
            </MenuOptionItem>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
})

I18nButton.displayName = "I18nButton"

type MobileMenuProps = DrawerProps

const MobileMenu: FC<MobileMenuProps> = memo(({ isOpen, onClose }) => {
  const { events } = useRouter()
  const breakpoint = useBreakpoint()

  useEffect(() => {
    if (!["lg", "md", "sm"].includes(breakpoint)) onClose()
  }, [breakpoint, onClose])

  useEffect(() => {
    events.on("routeChangeComplete", onClose)

    return () => {
      events.off("routeChangeComplete", onClose)
    }
  }, [events, onClose])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      withCloseButton={false}
      isFullHeight
    >
      <DrawerHeader
        justifyContent="flex-end"
        pt="sm"
        fontSize="md"
        fontWeight="normal"
      >
        <ButtonGroup isMobile {...{ isOpen, onClose }} />
      </DrawerHeader>

      <DrawerBody position="relative" my="sm">
        <VStack
          as="nav"
          overflowY="scroll"
          overscrollBehavior="contain"
        ></VStack>

        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          zIndex="kurillin"
          w="full"
          h="3"
          bgGradient={[
            "linear(to-t, rgba(255, 255, 255, 0), white)",
            "linear(to-t, rgba(0, 0, 0, 0), black)",
          ]}
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          zIndex="kurillin"
          w="full"
          h="3"
          bgGradient={[
            "linear(to-b, rgba(255, 255, 255, 0), white)",
            "linear(to-b, rgba(0, 0, 0, 0), black)",
          ]}
        />
      </DrawerBody>
    </Drawer>
  )
})

MobileMenu.displayName = "MobileMenu"
