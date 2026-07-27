import ArticleFields from "./ArticleFields";
import CinemaShowFields from "./CinemaShowFields";
import EventFields from "./EventFields";
import FilmFields from "./FilmFields";
import GlossaryFields from "./GlossaryFields";
import InterviewFields from "./InterviewFields";
import PodcastFields from "./PodcastFields";
import ResearchFields from "./ResearchFields";
import ViralEscapeFields from "./ViralEscapeFields";

const components = {
  FILM: FilmFields,
  GLOSSARY: GlossaryFields,
  INTERVIEW: InterviewFields,
  PODCAST: PodcastFields,
  VIRAL_ESCAPE_LINES: ViralEscapeFields,
  ARTICLE: ArticleFields,
  RESEARCH: ResearchFields,
  CINEMA_SHOW: CinemaShowFields,
  EVENT: EventFields,
};

export default function ContentTypeFields({ form, actions, referenceOptions, canManageAuthors = false }) {
  const Component = components[form.type];
  return Component ? <Component form={form} actions={actions} referenceOptions={referenceOptions} canManageAuthors={canManageAuthors} /> : null;
}
