import {
  ArrowRightLeftIcon,
  CalendarIcon,
  FingerprintIcon,
  GaugeIcon,
  HomeIcon,
  LaptopIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "@yamada-ui/lucide"
import type { Component, IconProps } from "@yamada-ui/react"
import {
  Avatar,
  Box,
  Center,
  IconButton,
  Tooltip,
  VStack,
} from "@yamada-ui/react"
import { useState, type FC } from "react"

const mockdata = [
  { icon: HomeIcon, label: "Home" },
  { icon: GaugeIcon, label: "Dashboard" },
  { icon: LaptopIcon, label: "Analytics" },
  { icon: CalendarIcon, label: "Releases" },
  { icon: UserIcon, label: "Account" },
  { icon: FingerprintIcon, label: "Security" },
  { icon: SettingsIcon, label: "Settings" },
]

interface NavbarLinkProps {
  icon: Component<"svg", IconProps>
  label: string
  active?: boolean
  onClick?(): void
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} placement="right">
      <IconButton
        onClick={onClick}
        w="50px"
        h="50px"
        borderRadius="md"
        as={Center}
        colorScheme={active ? "primary" : undefined}
        variant={active ? "solid" : "ghost"}
        data-active={active || undefined}
        icon={<Icon size="xl" />}
      />
    </Tooltip>
  )
}

const NavbarWithTooltips: FC = () => {
  const [active, setActive] = useState(0)

  return (
    <VStack
      w="80px"
      minH="750px"
      h="full"
      p="md"
      borderRight="1px solid"
      borderRightColor={["blackAlpha.500", "whiteAlpha.500"]}
    >
      <Center>
        <Avatar
          src="https://avatars.githubusercontent.com/u/84060430?v=4"
          size="md"
        />
      </Center>

      <Box flex={1} mt="xl">
        <VStack gap={0}>
          {mockdata.map((link, index) => (
            <NavbarLink
              {...link}
              key={link.label}
              active={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </VStack>
      </Box>

      <VStack gap={0}>
        <NavbarLink icon={ArrowRightLeftIcon} label="Change account" />
        <NavbarLink icon={LogOutIcon} label="Logout" />
      </VStack>
    </VStack>
  )
}

export default NavbarWithTooltips
