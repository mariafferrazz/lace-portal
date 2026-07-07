import ArchivePage from "../../components/pages/ArchivePage";
import { archivePages } from "../../data/archivePages";

export default function Artigos() {
  return <ArchivePage {...archivePages.artigos} />;
}
