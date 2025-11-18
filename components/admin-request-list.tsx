"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getPusherClient } from "@/lib/pusher";

type Request = {
    id: string;
    title: string;
    category: string;
    description: string;
    status: string;
    linearIssueId: string | null;
    linearIssueUrl: string | null;
    createdAt: string;
    organization: {
        id: string;
        name: string;
    };
};

type Organization = {
    id: string;
    name: string;
    clerkId: string;
};

interface AdminRequestListProps {
    initialRequests: Request[];
    organizations: Organization[];
}

export default function AdminRequestList({
    initialRequests,
    organizations,
}: AdminRequestListProps) {
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [filteredOrgId, setFilteredOrgId] = useState<string>("all");

    useEffect(() => {
        const pusher = getPusherClient();
        const channel = pusher.subscribe("requests");

        channel.bind(
            "request-updated",
            (data: { requestId: string; status: string }) => {
                setRequests((prev) =>
                    prev.map((req) =>
                        req.id === data.requestId ? { ...req, status: data.status } : req
                    )
                );
            }
        );

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status: string) => {
        return status.replace("_", " ");
    };

    const filteredRequests =
        filteredOrgId === "all"
            ? requests
            : requests.filter((req) => req.organization.id === filteredOrgId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Requests</h2>
                <div className="w-64">
                    <Select value={filteredOrgId} onValueChange={setFilteredOrgId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by organization" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Organizations</SelectItem>
                            {organizations.map((org) => (
                                <SelectItem key={org.id} value={org.id}>
                                    {org.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <Card key={request.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{request.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {request.category} • {request.organization.name}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            request.status
                                        )}`}
                                    >
                                        {formatStatus(request.status)}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {request.description}
                                </p>

                                {/* Linear Integration Info - Always Show */}
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs font-semibold text-blue-900 mb-2">
                                        🔗 Linear Integration
                                    </p>
                                    <p className="text-xs text-blue-800 mb-1">
                                        <span className="font-medium">Issue ID:</span>{" "}
                                        <code className="bg-blue-100 px-2 py-0.5 rounded">
                                            {request.linearIssueId || "-NS-"}
                                        </code>
                                    </p>
                                    <p className="text-xs text-blue-800">
                                        <span className="font-medium">Full URL:</span>{" "}
                                        {request.linearIssueUrl ? (
                                            <a
                                                href={request.linearIssueUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                            >
                                                {request.linearIssueUrl}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">-NS-</span>
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>
                                        {new Date(request.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    {request.linearIssueUrl && (
                                        <a
                                            href={request.linearIssueUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline font-medium"
                                        >
                                            View in Linear →
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
