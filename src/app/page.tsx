"use client";

import { Seo } from "@/components/Seo";
import { HeroSection } from "@/components/HeroSection";
import { SectionHeader } from "@/components/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { StatsBar } from "@/components/StatsBar";
import { ClientLogos } from "@/components/ClientLogos";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/Button";
import { ImageContentSection } from "@/components/ImageContentSection";
import { FAQAccordion, type FaqItem } from "@/components/FAQAccordion";
import { TechShowcase } from "@/components/TechShowcase";
import {
  services,
  proofPoints,
  clientLogos,
  techCategories,
} from "@/data/content";
import { heroImages, sectionImages } from "@/config/images";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const faqs: FaqItem[] = [
  {
    question: "Can you support remote and hybrid teams?",
    answer:
      "Yes. We support remote workstations, user access, cloud environments, and day-to-day IT issues for teams working across locations.",
  },
  {
    question: "What happens to our existing IT team?",
    answer:
      "We can work alongside your team, take care of a defined service area, or manage day-to-day support. We agree responsibilities and escalation paths before work begins.",
  },
  {
    question: "Which tools can you work with?",
    answer:
      "Our team works with Microsoft Intune, CrowdStrike, Tenable, Qualys, ServiceNow, AWS, and Azure. We can also work with the tools already in your environment.",
  },
  {
    question: "Do you offer long-term support agreements?",
    answer:
      "Yes. A maintenance agreement can be useful once we understand your environment and have built a working support process together. It is an option, not a requirement.",
  },
];

export default function Home() {
  return (
    <>
      <Seo
        meta={{
          title: "AStechnix | Managed IT Infrastructure & Remote Support",
          description:
            "AStechnix helps growing teams manage endpoints, protect devices, care for cloud environments, and resolve day-to-day IT issues.",
        }}
      />
      <HeroSection
        variant="dark"
        backgroundImage={heroImages.home}
        eyebrow="Enterprise IT Operations"
        title={
          <>
            Reliable IT Infrastructure and Remote Support for{" "}
            <span className="text-accent">Growing Teams</span>
          </>
        }
        description="We help organizations keep their remote workstations secure, cloud environments stable, and day-to-day operations running smoothly without the usual overhead."
      >
        <Button href="/contact" size="lg">
          Get in Touch <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            const element = document.getElementById("core-services");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            } else {
              console.warn("Element with id 'core-services' not found");
            }
          }}
          variant="outline-white"
          size="lg"
        >
          Explore Our Services
        </Button>
      </HeroSection>

      <ClientLogos logos={clientLogos} />
      <StatsBar points={proofPoints} variant="tainted" />

      <section id="core-services" className="section-padding bg-background">
        <div className="container-content">
          <SectionHeader
            eyebrow="Core Services"
            title={
              <>
                Practical support for the systems your team{" "}
                <span className="emphasis">depends on</span>
              </>
            }
            description="Clear service areas for endpoint care, device security, cloud environments, and everyday IT support."
            className="mb-12"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ImageContentSection
        image={sectionImages.teamCollaboration}
        imageAlt="IT team working together"
        eyebrow="How We Help"
        title={
          <>
            Keep everyday IT work{" "}
            <span className="emphasis">under control</span>
          </>
        }
        variant="tinted"
      >
        <p className="text-body">
          Your team should be able to work without chasing updates, device
          issues, access problems, or unclear security alerts. We provide
          practical support that keeps those tasks moving.
        </p>
        <div className="space-y-3 pt-2">
          {[
            "Remote laptops and workstations kept updated",
            "Security alerts reviewed and acted on",
            "Cloud environments checked for common gaps",
            "Support requests handled through a clear process",
          ].map((point) => (
            <div key={point} className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-body-sm">{point}</p>
            </div>
          ))}
        </div>
      </ImageContentSection>

      <section className="section-padding border-y border-border bg-surface">
        <div className="container-content">
          <SectionHeader
            eyebrow="Tools We Use"
            title={
              <>
                Trusted enterprise tools for{" "}
                <span className="emphasis">daily operations</span>
              </>
            }
            description="We work with established platforms used by enterprise IT teams every day."
            align="center"
            className="mb-10"
          />
          <TechShowcase categories={techCategories} variant="light" />
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-content max-w-3xl">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            align="center"
            className="mb-8"
          />
          <FAQAccordion items={faqs} />
        </div>
      </section>

      <CTASection
        title="Need a steadier way to manage IT?"
        description="Tell us about your team, devices, and current support needs. We will help you decide where to start."
      >
        <Link href="/contact">
          <Button variant="primary" size="lg">
            Get in Touch
          </Button>
        </Link>
      </CTASection>
    </>
  );
}
