import {
  CodeIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
} from "@yamada-ui/lucide"
import {
  assignRef,
  Flex,
  forwardRef,
  Heading,
  HStack,
  IconButton,
  noop,
  SegmentedControl,
  SegmentedControlButton,
  Tag,
  Text,
  VStack,
} from "@yamada-ui/react"
import type { SegmentedControlProps, StackProps } from "@yamada-ui/react"
import Link from "next/link"
import type { MutableRefObject, FC } from "react"
import { memo, useMemo, useRef, useState } from "react"
import { ComponentCodePreview } from "./component-code-preview"
import { ComponentPreview } from "./component-preview"
import type { Component } from "component"
import { Github } from "components/media-and-icons"
import { NextLinkIconButton } from "components/navigation"
import { CONSTANT } from "constant"
import { useDownload } from "hooks/use-download"

type Mode = "preview" | "code"

export type ComponentCardProps = StackProps & Component

export const ComponentCard = memo(
  forwardRef<ComponentCardProps, "div">(
    ({ name, metadata, slug, paths, components, ...rest }, ref) => {
      const modeRef = useRef<(mode: Mode) => void>(noop)
      const files = useMemo(
        () => components.map(({ name, code }) => ({ path: name, data: code })),
        [components],
      )
      const { onDownload } = useDownload({ folderName: name, files })

      return (
        <VStack
          ref={ref}
          as="article"
          borderWidth="1px"
          rounded="md"
          gap="0"
          {...rest}
        >
          <HStack
            as="header"
            gap={{ base: "md", sm: "sm" }}
            px="md"
            py="sm"
            borderBottomWidth="1px"
          >
            <HStack flex="1">
              <Heading as="h3" size="sm" fontWeight="semibold" lineClamp={1}>
                {metadata?.title}
              </Heading>

              <HStack gap="sm">
                {metadata?.labels?.slice(0, 5).map((label, index) => (
                  <Link key={index} href={`/search?labels=${label}`}>
                    <Tag
                      size="sm"
                      colorScheme="primary"
                      variant="outline"
                      cursor="pointer"
                    >
                      {label}
                    </Tag>
                  </Link>
                ))}
              </HStack>
            </HStack>

            <HStack gap="sm" z="0">
              <IconButton
                aria-label="Download the files"
                variant="outline"
                size="sm"
                display={{ base: "flex", sm: "none" }}
                borderColor="border"
                color="muted"
                icon={<DownloadIcon fontSize="md" />}
                onClick={() => onDownload()}
              />

              <NextLinkIconButton
                aria-label="Open component preview"
                href={slug}
                isExternal
                variant="outline"
                size="sm"
                borderColor="border"
                color="muted"
                icon={<ExternalLinkIcon fontSize="md" />}
              />

              <NextLinkIconButton
                aria-label="GitHub source code"
                href={`${CONSTANT.SNS.GITHUB.EDIT_URL}${slug}`}
                isExternal
                variant="outline"
                size="sm"
                display={{ base: "flex", sm: "none" }}
                borderColor="border"
                color="muted"
                icon={<Github boxSize="1rem" />}
              />

              <ViewModeControl
                modeRef={modeRef}
                display={{ base: "flex", sm: "none" }}
              />
            </HStack>
          </HStack>

          <ComponentCardBody
            modeRef={modeRef}
            {...{ metadata, paths, components }}
          />
        </VStack>
      )
    },
  ),
)

ComponentCard.displayName = "ComponentCard"

type ViewModeControlProps = SegmentedControlProps & {
  modeRef: MutableRefObject<(mode: Mode) => void>
}

const ViewModeControl: FC<ViewModeControlProps> = memo(
  ({ modeRef, ...rest }) => {
    return (
      <SegmentedControl
        size="sm"
        minW={{ base: "xs", md: "auto" }}
        defaultValue="preview"
        onChange={(mode) => modeRef.current(mode as Mode)}
        {...rest}
      >
        <SegmentedControlButton value="preview">
          <Flex alignItems="center" gap="sm">
            <EyeIcon fontSize="md" color="muted" />
            <Text display={{ base: "inline", md: "none" }}>Preview</Text>
          </Flex>
        </SegmentedControlButton>

        <SegmentedControlButton value="code">
          <Flex alignItems="center" gap="sm">
            <CodeIcon fontSize="md" color="muted" />
            <Text display={{ base: "inline", md: "none" }}>Code</Text>
          </Flex>
        </SegmentedControlButton>
      </SegmentedControl>
    )
  },
)

ViewModeControl.displayName = "ViewModeControl"

type ComponentCardBodyProps = Pick<
  Component,
  "paths" | "components" | "metadata"
> & {
  modeRef: MutableRefObject<(mode: Mode) => void>
}

const ComponentCardBody: FC<ComponentCardBodyProps> = memo(
  ({ modeRef, paths, components, metadata }) => {
    const [mode, setMode] = useState<Mode>("preview")

    assignRef(modeRef, setMode)

    return (
      <>
        <ComponentPreview
          paths={paths}
          containerProps={metadata?.options?.container}
          display={mode === "preview" ? "flex" : "none"}
          z="1"
        />
        <ComponentCodePreview
          components={components}
          display={mode === "code" ? "flex" : "none"}
        />
      </>
    )
  },
)

ComponentCardBody.displayName = "ComponentCardBody"
