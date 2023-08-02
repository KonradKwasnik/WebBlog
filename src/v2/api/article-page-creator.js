const { createUser } = require("./createUser")
const { getArticleThumbnail } = require("./getArticleThumbnail")
const { sortByDates } = require("./sortByDates")
const meta = require("../core/meta.json")
const article_en = require("../translation/article/en.json")
const article_pl = require("../translation/article/pl.json")
const { createTechnologies } = require("./createTechnologies")
const { createLayout } = require("./create-layout")

const ArticlePageCreator = ({ createPage }) => ({
  makeComponent,
  makeSlug,
  makeGaPage,
  makeSourceUrl,
  makeTranslationPath,
  makePath,
}) => ({
  articles,
  authorsAvatars,
  articleThumbnails,
  technologiesAvatars,
  authors,
}) => {
  const sortedArticles = sortByDates(articles)
  const articleTranslations = {
    pl: article_pl,
    en: article_en,
  }

  const data = sortedArticles.map((article, index) => {
    const { body } = article
    const slug = makeSlug(article)
    const {
      langs,
      cdate,
      mdate,
      title,
      lang,
      tags,
      seniorityLevel,
      description,
      readTime,
      stack,
      authorId,
      treviewerId,
      lreviewerId,
    } = article.frontmatter

    const path = makePath({ slug })
    const author = createUser(authorId, authors, authorsAvatars)
    const tech_reviewer = createUser(treviewerId, authors, authorsAvatars)
    const ling_reviewer = createUser(lreviewerId, authors, authorsAvatars)
    const articlePageObject = {
      author: {
        ...author,
        avatar: {
          medium: author.avatar.medium,
          small: author.avatar.small,
        },
      },
      tech_reviewer: {
        ...tech_reviewer,
        avatar: {
          small: tech_reviewer.avatar.small,
        },
      },
      ling_reviewer: {
        ...ling_reviewer,
        avatar: {
          small: ling_reviewer.avatar.small,
        },
      },
      thumbnail: getArticleThumbnail(slug, articleThumbnails),
      t: articleTranslations[lang],
      cdate,
      mdate,
      lang,
      title,
      tags,
      seniority: seniorityLevel,
      description,
      body,
      url: meta.site_url + path,
      read_time: readTime,
      slug,
      path: makePath({ slug }),
      ga_page: makeGaPage({ slug }),
      source_url: makeSourceUrl({ slug, meta }),
      is_new: index === 0,
      technologies: createTechnologies(stack, technologiesAvatars),
    }

    if (Array.isArray(langs) && langs.length > 0) {
      articlePageObject.translation_path = makeTranslationPath({ slug })
    }

    const prev = sortedArticles[index - 1]
    const next = sortedArticles[index + 1]

    if (prev) {
      const slug = makeSlug(prev)

      articlePageObject.prev = {
        title: prev.frontmatter.title,
        thumbnail: getArticleThumbnail(slug, articleThumbnails).medium,
        path: makePath({ slug }),
      }
    }

    if (next) {
      const slug = makeSlug(next)

      articlePageObject.next = {
        title: next.frontmatter.title,
        thumbnail: getArticleThumbnail(slug, articleThumbnails).medium,
        path: makePath({ slug }),
      }
    }

    return articlePageObject
  })

  const { lang } = data[0]

  const layout = createLayout({
    lang,
    articles: data,
    articleThumbnails,
  })

  data.forEach(article => {
    createPage({
      path: article.path,
      component: makeComponent(),
      context: {
        article,
        layout,
      },
    })
  })

  return [layout, data]
}

module.exports = {
  ArticlePageCreator,
}