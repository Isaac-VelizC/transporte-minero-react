import Breadcrumb from '@/Components/Breadcrumbs/Breadcrumb'
import Card from '@/Components/Card'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

type Props = {}

export default function index({}: Props) {
  return (
    <Authenticated>
        <Head title='Reports'/>
        <Breadcrumb pageName='Reports' />
        <Card>
            <div>Reportes</div>
        </Card>
    </Authenticated>
  )
}