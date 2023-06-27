import React from "react"
import { Banner, Code, useModal } from "../../ui"
import styled from "styled-components"
import theme from "../../utils/theme"
import { useScrollToCurrentFrame } from "./useScrollToCurrentFrame"
import { SnippetCreatorAction, SnippetCreatorState } from "./defs"
import Badge from "../../components/article/Badge"
import { FramesProgress } from "./FramesProgress"
import {
  AddFrameButton,
  AutoPlayButton,
  DeleteFrameButton,
  EditButton,
  MenuButton,
  NextButton,
  PreviousButton,
  SubmitFramesButton,
} from "./Buttons"
import { T_DOWN } from "../../utils/viewport"
import { Navigation } from "./Navigation"
import { useKeyPress } from "../../utils/useKeyPress"
import { useClickOutside } from "../../utils/useClickOutside"
import { MAX_FRAMES_COUNT, MIN_FRAMES_COUNT } from "./consts"
import { Confirmation } from "./Confirmation"

const Dot = styled.div`
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: ${theme.grayC};
`

const Container = styled.div`
  display: grid;
  grid-template-rows: auto;
  transition: 0.15s all ease-in-out;

  &.open {
    grid-template-columns: 260px 1fr;

    @media ${T_DOWN} {
      grid-template-columns: 1fr;
    }
  }

  &.closed {
    grid-template-columns: 0px 1fr;

    @media ${T_DOWN} {
      grid-template-columns: 1fr;
    }
  }

  .snippet-creator-btn svg path {
    fill: ${theme.black};
  }

  .snippets-creator-header {
    position: relative;
    transition: 0.2s all ease-in-out;
    width: 260px;
    background: black;

    @media ${T_DOWN} {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
    }

    &.open {
      transform: translateX(0);
    }

    &.closed {
      transform: translateX(-260px);
    }

    .frames {
      padding: 20px;
      height: 100vh;
      overflow-y: auto;
      position: sticky;
      border-right: 1px solid ${theme.grayC};
      top: 0;

      .frame {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 160px;
        max-width: 280px;
        overflow: hidden;
        flex-shrink: 0;
        border: 2px solid transparent;

        &.active {
          border-color: ${theme.primary};
        }

        &:hover:not(.active) {
          border-color: transparent;
        }

        pre {
          transform: scale(0.4);
          overflow: hidden;
        }

        .frame-badge {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .panel {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          cursor: pointer;
          background: transparent;
          backdrop-filter: blur(1px);
          bottom: 0;
          display: none;
          justify-content: flex-end;
        }

        &:hover .panel {
          display: flex;
        }
      }
    }
  }

  .main-view-code {
    padding: 20px 20px 80px 20px;
    max-width: 100vw;

    .main-view-banner {
      margin-bottom: 20px;
    }
  }
`

interface SandboxProps {
  state: SnippetCreatorState
  action: SnippetCreatorAction
}

const Sandbox = ({ state, action }: SandboxProps) => {
  const { ref } = useScrollToCurrentFrame<HTMLDivElement>(state)
  const isOpen = state.isNavigationPanelOpen
  const openClass = isOpen ? "open" : "closed"
  const confirmation = useModal()

  const { selectedFrame, frames, autoPlay } = state

  useKeyPress({
    onKeyPress: e => {
      const actions = {
        a: action.goToPreviousFrame,
        d: action.goToNextFrame,
        n: action.startAdd,
        p: action.toggleAutoPlay,
        e: () => action.startEdit(selectedFrame!),
        r: () => confirmation.open(),
        c: action.toggleNavigationPanel,
        s: action.startSubmit,
        escape: () => {
          confirmation.isOpen ? confirmation.close() : action.goToIdle()
        },
      }

      actions[e.key.toLowerCase()]?.()
    },
  })

  const { ref: headerRef } = useClickOutside<HTMLDivElement>({
    onOutside: action.closeNavigationPanel,
  })

  const maxFramesExceeded = state.frames.length >= MAX_FRAMES_COUNT

  return (
    <>
      {autoPlay && (
        <FramesProgress frameId={selectedFrame!.id} frames={frames} />
      )}

      {confirmation.isOpen && (
        <Confirmation
          onClose={confirmation.close}
          onConfirm={() => {
            confirmation.close()
            action.removeFrame(selectedFrame!.id)
          }}
        />
      )}

      <Container className={openClass}>
        <div className={`snippets-creator-header ${openClass}`} ref={headerRef}>
          <div className="frames" ref={ref}>
            {state.frames.map((frame, idx) => (
              <div
                key={frame.id}
                className={`frame ${
                  frame.id === selectedFrame!.id ? "active" : ""
                }`}
                onClick={() => action.goToFrame(frame.id)}
              >
                <Code>{frame.code}</Code>
                <Badge
                  className="frame-badge"
                  background={theme.primary}
                  color={theme.bg}
                >
                  {idx + 1}
                </Badge>
                <div className="panel" />
              </div>
            ))}
          </div>
        </div>

        <div className="main-view-code">
          <div className="main-view-code-wrapper">
            {maxFramesExceeded && (
              <Banner className="main-view-banner">
                You can't add more frames. The maximum amount is{" "}
                {MAX_FRAMES_COUNT}. Delete a frame to add a new one.
              </Banner>
            )}

            {selectedFrame && <Code animated>{selectedFrame.code}</Code>}

            <Navigation>
              <MenuButton
                open={isOpen}
                onClick={action.toggleNavigationPanel}
              />

              {state.frames.length > MIN_FRAMES_COUNT && (
                <>
                  <PreviousButton onClick={action.goToPreviousFrame} />
                  <NextButton onClick={action.goToNextFrame} />
                  <AutoPlayButton
                    playing={autoPlay}
                    onClick={action.toggleAutoPlay}
                  />
                </>
              )}

              <Dot />

              {state.frames.length > MIN_FRAMES_COUNT && (
                <DeleteFrameButton
                  onClick={e => {
                    e.stopPropagation()
                    confirmation.open()
                  }}
                />
              )}

              <EditButton
                onClick={e => {
                  e.stopPropagation()
                  action.startEdit(selectedFrame!)
                }}
              />

              <Dot />

              {maxFramesExceeded || (
                <AddFrameButton onClick={action.startAdd} />
              )}

              <SubmitFramesButton onClick={action.startSubmit} />
            </Navigation>
          </div>
        </div>
      </Container>
    </>
  )
}

export { Sandbox }