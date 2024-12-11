import Breadcrumb from "@/Components/Breadcrumbs/Breadcrumb"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"

type Props = {}

function index({}: Props) {
  return (
    <Authenticated>
      <Head title="Envios"/>
      <Breadcrumb pageName="Envios list" />
    </Authenticated>
  )
}

export default index