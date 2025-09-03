// components/ui/CardHeader.tsx
import React from "react";
import Heading from "./Heading";
import Button from "./Button";

interface CardHeaderProps {
  title: string;
  actionText?: string;
  actionHref?: string;
  showTools?: boolean; // for card-tools buttons
  transparentBorder?: boolean; // for border-transparent
}

export default function CardHeader({
  title,
  actionText,
  actionHref = "#",
  showTools = false,
  transparentBorder = false
}: CardHeaderProps) {
  return (
    <div className={`card-header ${transparentBorder ? "border-transparent" : ""}`}>
      <div className="d-flex justify-content-between align-items-center">
        <Heading level={3} className="card-title mb-0">
          {title}
        </Heading>

        <div className="d-flex align-items-center gap-2">
          {actionText && <a href={actionHref}>{actionText}</a>}

          {showTools && (
            <div className="card-tools d-flex gap-2">
              <Button type="button" className="btn btn-tool" data-card-widget="collapse">
                <i className="fas fa-minus"></i>
              </Button>
              <Button type="button" className="btn btn-tool" data-card-widget="remove">
                <i className="fas fa-times"></i>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
