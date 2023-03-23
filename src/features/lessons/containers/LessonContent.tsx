import { MDXRenderer } from "gatsby-plugin-mdx"
import React from "react"
import styled from "styled-components"
import MobileNavigation from "../../../components/navigation/MobileNavigation"
import Navbar from "../../../components/navigation/Navbar"
import theme from "../../../utils/theme"
import { L_DOWN, SM_DOWN } from "../../../utils/viewport"
import { CourseChapters } from "../../courses/components/course-chapters/CourseChapters"
import { useLessonProvider } from "../LessonProvider"
import Button from "../../../components/button/Button"
import { Link as GatsbyLink } from "gatsby"
import Loadable from "react-loadable"

const MobileCourseChapters = Loadable({
  loader: () =>
    import("../../courses/components/mobile-course-chapters").then(
      m => m.MobileCourseChapters
    ),
  loading: () => null,
})

const CourseChaptersWrapper = styled.div`
  position: relative;

  & > * {
    position: sticky;
    top: 0;
    right: 0;
    padding-top: 20px;
    background: ${theme.bg};
  }
`

const Layout = styled.main`
  display: grid;
  grid-template-columns: 920px 1fr;
  gap: 32px;
  padding: 40px 24px;
  margin: 0 auto;
  max-width: 1280px;

  .ui-snippet {
    max-width: 920px;

    @media ${L_DOWN} {
      max-width: calc(100vw - 48px);
    }
  }

  @media ${L_DOWN} {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;

    ${CourseChaptersWrapper} {
      display: none;
    }
  }
`

const Dates = styled.div`
  display: flex;
  flex-flow: wrap;
`

const Content = styled.div`
  ${Dates} {
    margin: 32px 0 40px 0;

    & > * {
      margin: 0 10px 10px 0;

      @media ${SM_DOWN} {
        width: 100%;
        margin: 0 0 10px 0;
        text-align: center;
      }
    }
  }
`

const CourseNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;

  & > *:first-child {
    margin-right: 20px;
  }
`

export const LessonContent = () => {
  const { course, chapter, lesson } = useLessonProvider()

  return (
    <>
      <Navbar />
      <MobileNavigation />
      <MobileCourseChapters
        chapters={course.chapters}
        lessonId={lesson.id}
        chapterId={chapter.id}
      />
      <Layout>
        <Content>
          <MDXRenderer>{lesson.body}</MDXRenderer>
          <CourseNavigation>
            {lesson.prevLesson && (
              <GatsbyLink to={lesson.prevLesson.path}>
                <Button>PREVIOUS</Button>
              </GatsbyLink>
            )}
            {lesson.nextLesson && (
              <GatsbyLink to={lesson.nextLesson.path}>
                <Button>NEXT</Button>
              </GatsbyLink>
            )}
          </CourseNavigation>
        </Content>
        <CourseChaptersWrapper>
          <CourseChapters
            activeChapterId={chapter.id}
            activeLessonId={lesson.id}
            chapters={course.chapters}
          />
        </CourseChaptersWrapper>
      </Layout>
    </>
  )
}