import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion Confirmation - petbar.mk",
  description: "Your data has been deleted from petbar.mk",
};

export default function DataDeletionConfirmationPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-0">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Data Deletion Confirmation</h1>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex justify-center mb-4">
            <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Data Has Been Deleted</h2>
          <p className="text-gray-600 mb-4">We have successfully processed your request to delete your data from our systems.</p>
          <p className="text-gray-600">If you have any questions or concerns, please contact our support team.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
