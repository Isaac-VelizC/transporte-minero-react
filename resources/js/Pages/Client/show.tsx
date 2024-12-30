import { ShipmentInterface } from '@/interfaces/Shipment'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

type Props = {
    envio: ShipmentInterface;
}

export default function show({envio}: Props) {
  return (
    <Authenticated>
        <Head title='Show Envio' />
        <div>Hola munfo soy envio {envio.destino}</div>
    </Authenticated>
  )
}