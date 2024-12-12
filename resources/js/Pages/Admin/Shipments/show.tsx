import Breadcrumb from '@/Components/Breadcrumbs/Breadcrumb'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

type Props = {}

function show({}: Props) {
  return (
    <Authenticated>
      <Head title="Show"/>
      <Breadcrumb pageName="Show list" />
      <div></div>
    </Authenticated>
  )
}

export default show;