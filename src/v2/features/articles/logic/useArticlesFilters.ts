import { useMemo, useState } from "react"
import { ArticlesPageModelArticleAuthor, Seniority } from "../../../core/models"
import { useArticlesPageProvider } from "../ArticlesPageProvider"

interface ArticlesFilters {
  authors: Record<string, boolean>
  seniorityLevels: Record<string, boolean>
  query: string
}

const useArticlesFilters = () => {
  const { authors, articles } = useArticlesPageProvider()
  const initialFilters = useMemo(
    (): ArticlesFilters => ({
      authors: authors.reduce<Record<string, boolean>>(
        (acc, author) => ({
          ...acc,
          [author.id]: true,
        }),
        {}
      ),
      seniorityLevels: Object.keys(Seniority).reduce<Record<string, boolean>>(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      ),
      query: "",
    }),
    []
  )
  const [filters, setFilters] = useState(initialFilters)

  const allAuthorsSelected = useMemo(
    () =>
      Object.values(filters.authors).filter(flag => flag).length ===
      authors.length,
    [filters.authors]
  )

  const allSeniorityLevelsSelected = useMemo(
    () =>
      Object.values(filters.seniorityLevels).filter(flag => flag).length ===
      Object.values(Seniority).length,
    [filters.seniorityLevels]
  )

  const changed = useMemo(
    () => JSON.stringify(initialFilters) !== JSON.stringify(filters),
    [filters]
  )

  const changeSeniority = (seniority: string) => {
    setFilters({
      ...filters,
      seniorityLevels: {
        ...filters.seniorityLevels,
        [seniority]: filters.seniorityLevels[seniority] ? false : true,
      },
    })
  }

  const changeAuthor = (id: ArticlesPageModelArticleAuthor["id"]) => {
    setFilters({
      ...filters,
      authors: {
        ...filters.authors,
        [id]: filters.authors[id] ? false : true,
      },
    })
  }

  const changeQuery = (query: string) => {
    setFilters({
      ...filters,
      query,
    })
  }

  const setAllAuthors = () => {
    setFilters({
      ...filters,
      authors: allAuthorsSelected ? {} : initialFilters.authors,
    })
  }

  const setAllSeniorityLevels = () => {
    setFilters({
      ...filters,
      seniorityLevels: allSeniorityLevelsSelected
        ? {}
        : initialFilters.seniorityLevels,
    })
  }

  const reset = () => {
    setFilters(initialFilters)
  }

  const filteredArticles = useMemo(() => {
    const filtered = articles.filter(
      article =>
        !!filters.authors[article.author.id] &&
        !!filters.seniorityLevels[article.seniority]
    )

    const query = filters.query.trim().toLowerCase()

    if (query !== "") {
      return filtered.filter(article =>
        article.title.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [articles, filters])

  return {
    filters,
    allAuthorsSelected,
    allSeniorityLevelsSelected,
    changed,
    filteredArticles,
    changeSeniority,
    changeAuthor,
    reset,
    setAllAuthors,
    changeQuery,
    setAllSeniorityLevels,
  }
}

export { useArticlesFilters }
