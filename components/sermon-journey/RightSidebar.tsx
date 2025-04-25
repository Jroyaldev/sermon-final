import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface RightSidebarProps {
    // Example: activeSeries?: { name: string; progress: string };
}

export function RightSidebar({ }: RightSidebarProps) {
    return (
        <div className="hidden w-80 border-l bg-[#f9f8f6] dark:bg-[#1d1a17] p-6 xl:block">
            <div className="space-y-8">
                <div>
                    <h3 className="text-base font-medium mb-4">CHURCH CALENDAR</h3>
                    <div className="space-y-2.5">
                        <Button variant="outline" className="w-full justify-start gap-2 mt-2">
                            <Calendar className="h-4 w-4" />
                            View all events
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-4">CONGREGATION NEEDS</h3>
                    <Card className="overflow-hidden">
                        <div className="space-y-3 p-4">
                            <div className="pt-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full justify-center text-sm"
                                >
                                    View all needs
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-4">LITURGICAL SEASON</h3>
                    <div className="flex flex-wrap gap-2">
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-medium mb-4">ACTIVE SERIES</h3>
                    <Card className="overflow-hidden bg-[#f9f7f2] dark:bg-[#272320]">
                        <div className="p-4">
                            <h4 className="font-medium text-[#3c3528] dark:text-[#e8e3d9]">
                                Peace That Passes Understanding
                            </h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                                2 of 4 messages prepared
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
} 