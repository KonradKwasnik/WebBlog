import React from "react"
import styled from "styled-components"
import { ShareButton } from "./ShareButton"
import { useLayoutProvider } from "../providers/LayoutProvider"
import { useAnalytics } from "../../utils/useAnalytics"
import { Link as GatsbyLink } from "gatsby"
import { T_DOWN } from "../../utils/viewport"
import { useArticleProvider } from "../providers/ArticleProvider"

const Container = styled.nav`
  display: flex;
  justify-content: right;

  & > *:not(:first-child) {
    margin: 0 0 0 20px;
  }

  @media ${T_DOWN} {
    flex-flow: column;

    & > *:not(:first-child) {
      margin: 20px 0 0 0;
    }
    
    & > * {
      max-width: 100%;
      width: 100%;
    }
  }
`

const NavigationSection = () => {
  const layout = useLayoutProvider()
  const { state: data } = useArticleProvider()
  const { track } = useAnalytics()

  return (
    <Container className="navigation-section">
      <ShareButton
        url={data.source_url}
        link={data.url}
        title={data.title}
        description={data.description}
        time={data.duration}
        level={data.seniority}
        tags={data.tags}
        stack={data.technologies.map(({ id }) => id)}
      />
      <a
        className="button primary upper"
        href={data.source_url}
        target="_blank"
        onClick={() => track({ name: "source_clicked" })}
      >
        {layout.t.show_source}
      </a>
      {data.prev && (
        <GatsbyLink className="button primary upper" to={data.prev.path}>
          {layout.t.prev}
        </GatsbyLink>
      )}
      {data.next && (
        <GatsbyLink className="button primary upper" to={data.next.path}>
          {layout.t.next}
        </GatsbyLink>
      )}
    </Container>
  )
}

export { NavigationSection }
