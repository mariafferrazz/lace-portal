import ArchivePage from "../../components/pages/ArchivePage";
import { archivePages } from "../../data/archivePages";

export default function Entrevistas() {
  return <ArchivePage {...archivePages.entrevistas} />;
}
