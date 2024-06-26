import type { DecoratorFunction } from "@storybook/addons"
import type { Story } from "@storybook/react"

import { GlobalStyle } from "../src/global-style"

const withGlobalStyleDecorator: DecoratorFunction<JSX.Element> = (
  StoryComponent: Story
) => (
  <>
    {/* Here we are using the previously created global styles. */}
    <GlobalStyle />
    <StoryComponent />
  </>
)

const decorators = [withGlobalStyleDecorator]

export { decorators }
