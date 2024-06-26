import React, { useEffect, useMemo, ReactNode, useState } from "react"
import { useCounter } from "../../utils/useCounter"
import { useInterval } from "../../utils/useInterval"
import { Code } from "../../v2/ui/code/Code"
import { StaticCodeProps } from "../ui/code/models"

type Frames = string[]

export type FooterPayload = {
  counter: ReturnType<typeof useCounter>
  autoPlay: boolean
  setAutoPlay: (autoPlay: boolean) => void
}

export interface CodeFramesProps
  extends Omit<StaticCodeProps, "mode" | "children" | "skipTrim"> {
  delay?: number
  frames: Frames
  className?: string
  footer?: (payload: FooterPayload) => ReactNode
  autoPlayOnInit?: boolean
}

export const preserveSpaceForFrames = (frames: Frames): Frames => {
  const splitted = frames.map(frame => frame.trim().split("\n"))

  const max = splitted.reduce(
    (acc, split) => (acc >= split.length ? acc : split.length),
    0
  )

  const enhanced = frames.map((code, idx) => {
    let enhancedCode = code.trim()
    const diff = max - splitted[idx].length

    for (let i = 0; i < diff; i++) {
      enhancedCode += "\n"
    }

    return enhancedCode
  }, [])

  return enhanced
}

const CodeFrames = ({
  delay,
  frames,
  footer,
  autoPlayOnInit = true,
  ...props
}: CodeFramesProps) => {
  const [autoPlay, setAutoPlay] = useState(autoPlayOnInit)
  const counter = useCounter(0, frames.length - 1)

  const interval = useInterval({
    delay,
    onTick: counter.next,
  })

  const enhancedFrames = useMemo(() => preserveSpaceForFrames(frames), [frames])

  useEffect(() => {
    if (autoPlay) {
      interval.start()
    } else {
      interval.cancel()
    }
  }, [autoPlay])

  return (
    <Code
      {...props}
      mode="static"
      skipTrim
      Footer={
        footer
          ? () =>
              footer({
                counter,
                autoPlay,
                setAutoPlay,
              })
          : undefined
      }
    >
      {enhancedFrames[counter.counter]}
    </Code>
  )
}

export { CodeFrames }
