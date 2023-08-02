import React from "react"
import styled, { keyframes } from "styled-components"
import Loadable from "react-loadable"
import Image from "gatsby-image"
import { useHomePageProvider } from "../HomePageProvider"
import { Content, Huge } from "../../../../ui"
import theme from "../../../../utils/theme"
import { M_DOWN } from "../../../../utils/viewport"

const animateIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
  position: relative;
  overflow: hidden;

  canvas {
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    animation: ${animateIn} 0.4s ease-in-out 0s forwards;
  }

  ${Huge} {
    display: flex;
    justify-content: center;
    max-width: 300px;
    text-align: center;
    text-shadow: -6px 11px 15px ${theme.black};
    z-index: 1;

    @media ${M_DOWN} {
      font-size: 48px;
    }
  }
`

const Wrapper = styled.div`
  position: relative;
`

const BlackHoleWrapper = Loadable({
  loader: () => import("./BlackHoleWrapper").then(m => m.BlackHoleWrapper),
  loading: () => null,
})

const imageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
}

const BlackHoleSection = () => {
  const home = useHomePageProvider()

  return (
    <Wrapper>
      <Image
        loading="eager"
        fluid={home.thumbnail}
        alt={home.t.sentence}
        style={imageStyle}
      />
      <Content>
        <Container>
          <Huge>{home.t.sentence}</Huge>
          <BlackHoleWrapper />
        </Container>
      </Content>
    </Wrapper>
  )
}

export { BlackHoleSection }