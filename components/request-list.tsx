"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPusherClient } from "@/lib/pusher";

type Request = {
    id: string;
    title: string;
    category: string;
    description: string;
    status: string;
    linearIssueUrl: string | null;
    createdAt: string;
    organization: {
        name: string;
    };
};

interface RequestListProps {
    initialRequests: Request[];
}

export default function RequestList({ initialRequests }: RequestListProps) {
    const [requests, setRequests] = useState<Request[]>(initialRequests);

    useEffect(() => {
        const pusher = getPusherClient();
        const channel = pusher.subscribe("requests");

        channel.bind("request-updated", (data: { requestId: string; status: string }) => {
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === data.requestId ? { ...req, status: data.status } : req
                )
            );
        });

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

    if (requests.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No requests yet. Create your first request above!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((request) => (
                <Card key={request.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">{request.title}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {request.category}
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
                                    className="text-primary hover:underline"
                                >
                                    View in Linear →
                                </a>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
