import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplicationCard from "./ApplicationCard";
import type { Application } from "../types/index";

const pendingApplication: Application = {
  id: "app-101",
  jobId: "job-202",
  workerId: "worker-303",
  coverLetter: "I have experience with campus errand delivery.",
  status: "Pending",
};

describe("ApplicationCard", () => {
  it("shows the application ID, cover letter, and Pending status", () => {
    const handleReview = vi.fn();
    render(
      <ApplicationCard
        application={pendingApplication}
        onReview={handleReview}
      />,
    );

    expect(screen.getByText("Application #app-101")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(
      screen.getByText('"I have experience with campus errand delivery."'),
    ).toBeInTheDocument();
  });

  it("updates the displayed status when the application is Approved", () => {
    const handleReview = vi.fn();
    const approvedApplication: Application = {
      ...pendingApplication,
      status: "Approved",
    };

    render(
      <ApplicationCard
        application={approvedApplication}
        onReview={handleReview}
      />,
    );

    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("calls onReview with the application ID when clicked", async () => {
    const user = userEvent.setup();
    const handleReview = vi.fn();

    render(
      <ApplicationCard
        application={pendingApplication}
        onReview={handleReview}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Review Application" }),
    );
    expect(handleReview).toHaveBeenCalledWith("app-101");
  });
});
