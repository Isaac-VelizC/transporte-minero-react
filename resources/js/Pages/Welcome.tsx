import Preloader from "@/Components/Preloader";
import AboutSection from "@/container/aboutSection";
import ContactSection from "@/container/contactSection";
import HeroSection from "@/container/heroSection";
import ServiceSection from "@/container/serviceSection";
import FooterClient from "@/Layouts/client/FooterClient";
import HeaderClient from "@/Layouts/client/HeaderClient";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        // Simular tiempo de carga
        const timer = setTimeout(() => {
          setLoading(false);
        }, 3000);
    
        return () => clearTimeout(timer);
      }, []);

    return (
        <>
            <Head title="Welcome" />
            {loading && (
                <Preloader />
            )}
            {/* header-area start */}
            <HeaderClient authStatus={auth.user} />
            <HeroSection />
            <AboutSection />
            <ServiceSection />
            <ContactSection />
            <FooterClient />
        </>
    );
}
