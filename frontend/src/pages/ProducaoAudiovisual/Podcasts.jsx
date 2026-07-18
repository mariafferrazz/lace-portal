import ArchivePage from "../../components/pages/ArchivePage";
import { archivePages } from "../../data/archivePages";

export default function Podcasts() {
  return <ArchivePage {...archivePages.podcasts} contentType="PODCAST" />;
}
