"use client"
import jsPDF from "jspdf";
import { useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import {
    Building,
    User,
    Search,
    Filter,
    Clock,
    CheckCircle,
    AlertCircle,
    PenToolIcon as Tool,
    Loader2,
    MessageSquare,
    Zap,
    Droplet,
    Hammer,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    CheckCheck,
    Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./components/card"
import { Badge } from "./components/badge"
import { Button } from "./components/button"
import { Input } from "./components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/select"
import { Textarea } from "./components/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "./components/avatar"

// Types
type MaintenanceRequest = {
    id: string
    name: string
    studentId: string
    email: string
    phone: string
    building: string
    roomNo: string
    category: string
    problem: string
    priority: string
    visitTime: string
    status: "pending" | "in-progress" | "completed"
    dateSubmitted: string
    assignedTo?: string
    comments: {
        id: string
        text: string
        from: "admin" | "user"
        timestamp: string
    }[]
    hasImage: boolean
}

type StaffMember = {
    id: string
    name: string
    role: string
    avatar: string
}

// Mock data
const mockRequests: MaintenanceRequest[] = [
    {
        id: "MR-12345",
        name: "John Smith",
        studentId: "ST12345",
        email: "john.smith@university.edu",
        phone: "555-123-4567",
        building: "A",
        roomNo: "101",
        category: "electricity",
        problem:
            "The ceiling light in my room is flickering and sometimes doesn't turn on at all. I've tried changing the bulb but it didn't help.",
        priority: "medium",
        visitTime: "morning",
        status: "pending",
        dateSubmitted: "2025-04-05T14:30:00",
        comments: [
            {
                id: "c1",
                text: "I submitted this request because the light is making it difficult to study at night.",
                from: "user",
                timestamp: "2025-04-05T14:35:00",
            },
        ],
        hasImage: true,
    },
    {
        id: "MR-12346",
        name: "Emma Johnson",
        studentId: "ST12346",
        email: "emma.j@university.edu",
        phone: "555-123-7890",
        building: "B",
        roomNo: "205",
        category: "plumbing",
        problem:
            "The sink in my bathroom is clogged and water drains very slowly. I've tried using drain cleaner but it didn't work.",
        priority: "high",
        visitTime: "afternoon",
        status: "in-progress",
        dateSubmitted: "2025-04-06T09:15:00",
        assignedTo: "Mike Wilson",
        comments: [
            {
                id: "c2",
                text: "This is becoming a serious issue as the sink is now overflowing.",
                from: "user",
                timestamp: "2025-04-06T09:20:00",
            },
            {
                id: "c3",
                text: "We've assigned a plumber to check your sink. They will visit during your preferred afternoon time slot tomorrow.",
                from: "admin",
                timestamp: "2025-04-06T10:30:00",
            },
        ],
        hasImage: false,
    },
    {
        id: "MR-12347",
        name: "Michael Chen",
        studentId: "ST12347",
        email: "m.chen@university.edu",
        phone: "555-123-2468",
        building: "C",
        roomNo: "310",
        category: "carpentry",
        problem: "The door to my closet is off its hinges and won't close properly.",
        priority: "low",
        visitTime: "evening",
        status: "completed",
        dateSubmitted: "2025-04-04T16:45:00",
        assignedTo: "Robert Brown",
        comments: [
            {
                id: "c4",
                text: "The door has been like this since I moved in.",
                from: "user",
                timestamp: "2025-04-04T16:50:00",
            },
            {
                id: "c5",
                text: "A carpenter will visit your room tomorrow evening to fix the door.",
                from: "admin",
                timestamp: "2025-04-04T17:30:00",
            },
            {
                id: "c6",
                text: "The door has been fixed. Please let us know if you have any other issues.",
                from: "admin",
                timestamp: "2025-04-05T19:15:00",
            },
        ],
        hasImage: true,
    },
    {
        id: "MR-12348",
        name: "Sarah Williams",
        studentId: "ST12348",
        email: "s.williams@university.edu",
        phone: "555-123-3698",
        building: "D",
        roomNo: "415",
        category: "electricity",
        problem: "Two power outlets in my room are not working. I've tested them with different devices.",
        priority: "medium",
        visitTime: "morning",
        status: "pending",
        dateSubmitted: "2025-04-07T08:20:00",
        comments: [],
        hasImage: false,
    },
    {
        id: "MR-12349",
        name: "David Lee",
        studentId: "ST12349",
        email: "d.lee@university.edu",
        phone: "555-123-9876",
        building: "A",
        roomNo: "120",
        category: "plumbing",
        problem: "The shower in my bathroom is leaking and causing water to pool on the floor.",
        priority: "high",
        visitTime: "any",
        status: "in-progress",
        dateSubmitted: "2025-04-06T14:10:00",
        assignedTo: "Mike Wilson",
        comments: [
            {
                id: "c7",
                text: "This is urgent as the water is starting to seep into my room.",
                from: "user",
                timestamp: "2025-04-06T14:15:00",
            },
            {
                id: "c8",
                text: "We've scheduled an emergency visit. A plumber will be there within the next 2 hours.",
                from: "admin",
                timestamp: "2025-04-06T14:30:00",
            },
        ],
        hasImage: true,
    },
]

const maintenanceStaff: StaffMember[] = [
    { id: "staff1", name: "Mike Wilson", role: "Plumber", avatar: "" },
    { id: "staff2", name: "Robert Brown", role: "Carpenter", avatar: "" },
    { id: "staff3", name: "Lisa Johnson", role: "Electrician", avatar: "" },
    { id: "staff4", name: "James Smith", role: "General Maintenance", avatar: "" },
]
const handlePrint = (request: MaintenanceRequest) => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("Maintenance Request Details", 20, 20);
  
    doc.setFontSize(12);
    doc.text(`ID: ${request.id}`, 20, 40);
    doc.text(`Name: ${request.name}`, 20, 50);
    doc.text(`Phone: ${request.phone}`, 20, 60);
    doc.text(`Category: ${request.category}`, 20, 70);
    doc.text("Description:", 20, 80);
    doc.text(doc.splitTextToSize(request.problem ?? "N/A", 170), 20, 90);
  
    doc.save(`${request.id}.pdf`);
  };

export default function AdminDashboard() {
    // State
    const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests)
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [buildingFilter, setBuildingFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [newComment, setNewComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

    // Filter and sort requests
    const filteredRequests = requests
        .filter((request) => {
            // Search query
            const matchesSearch =
                request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.id.toLowerCase().includes(searchQuery.toLowerCase())

            // Status filter
            const matchesStatus = statusFilter === "all" || request.status === statusFilter

            // Building filter
            const matchesBuilding = buildingFilter === "all" || request.building === buildingFilter

            // Category filter
            const matchesCategory = categoryFilter === "all" || request.category === categoryFilter

            // Priority filter
            const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter

            return matchesSearch && matchesStatus && matchesBuilding && matchesCategory && matchesPriority
        })
        .sort((a, b) => {
            const dateA = new Date(a.dateSubmitted).getTime()
            const dateB = new Date(b.dateSubmitted).getTime()
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB
        })

    // Statistics
    const totalRequests = requests.length
    const pendingRequests = requests.filter((r) => r.status === "pending").length
    const inProgressRequests = requests.filter((r) => r.status === "in-progress").length
    const completedRequests = requests.filter((r) => r.status === "completed").length

    // Handle status update
    const updateStatus = (id: string, status: "pending" | "in-progress" | "completed") => {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            const updatedRequests = requests.map((request) => (request.id === id ? { ...request, status } : request))

            setRequests(updatedRequests)

            if (selectedRequest && selectedRequest.id === id) {
                setSelectedRequest({ ...selectedRequest, status })
            }

            setIsLoading(false)
        }, 500)
    }

    // Handle staff assignment
    const assignStaff = (requestId: string, staffId: string) => {
        const staffMember = maintenanceStaff.find((staff) => staff.id === staffId)

        if (!staffMember) return

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            const updatedRequests = requests.map((request) =>
                request.id === requestId ? { ...request, assignedTo: staffMember.name } : request,
            )

            setRequests(updatedRequests)

            if (selectedRequest && selectedRequest.id === requestId) {
                setSelectedRequest({ ...selectedRequest, assignedTo: staffMember.name })
            }

            setIsLoading(false)
        }, 500)
    }

    // Handle comment submission
    const submitComment = () => {
        if (!selectedRequest || !newComment.trim()) return

        setIsLoading(true)

        // Create new comment
        const comment = {
            id: `c${Date.now()}`,
            text: newComment,
            from: "admin" as const,
            timestamp: new Date().toISOString(),
        }

        // Simulate API call
        setTimeout(() => {
            const updatedRequests = requests.map((request) =>
                request.id === selectedRequest.id ? { ...request, comments: [...request.comments, comment] } : request,
            )

            setRequests(updatedRequests)
            setSelectedRequest({
                ...selectedRequest,
                comments: [...selectedRequest.comments, comment],
            })
            setNewComment("")
            setIsLoading(false)
        }, 500)
    }

    // Reset filters
    const resetFilters = () => {
        setSearchQuery("")
        setStatusFilter("all")
        setBuildingFilter("all")
        setCategoryFilter("all")
        setPriorityFilter("all")
    }

    // Helper functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "electricity":
                return <Zap className="w-5 h-5 text-yellow-500" />
            case "plumbing":
                return <Droplet className="w-5 h-5 text-blue-500" />
            case "carpentry":
                return <Hammer className="w-5 h-5 text-amber-600" />
            default:
                return <Tool className="w-5 h-5 text-gray-500" />
        }
    }

    const getCategoryName = (category: string) => {
        const categories: Record<string, string> = {
            electricity: "Electricity",
            plumbing: "Plumbing",
            carpentry: "Carpentry",
        }
        return categories[category] || category
    }

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "high":
                <Badge variant="default" className="bg-amre-500">
                        High
                    </Badge>
                return <Badge variant="destructive">High</Badge>
            case "medium":
                return (
                    <Badge variant="default" className="bg-amber-500">
                        Medium
                    </Badge>
                )
            case "low":
                return (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                        Low
                    </Badge>
                )
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                        Pending
                    </Badge>
                )
            case "in-progress":
                return (
                    <Badge variant="default" className="bg-blue-500">
                        In Progress
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="default" className="bg-green-600">
                        Completed
                    </Badge>
                )
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    const getBuildingName = (buildingCode: string) => {
        const buildings: Record<string, string> = {
            A: "Building A",
            B: "Building B",
            C: "Building C",
            D: "Building D",
        }
        return buildings[buildingCode] || buildingCode
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Tool className="w-8 h-8" />
                            <div>
                                <h1 className="text-2xl font-bold">Campus Maintenance Portal</h1>
                                <p className="text-blue-100">Admin Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2">
                                <span>Admin User</span>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Requests</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{totalRequests}</h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <MessageSquare className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{pendingRequests}</h3>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-full">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{inProgressRequests}</h3>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <RefreshCw className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Completed</p>
                                    <h3 className="text-3xl font-bold text-gray-900">{completedRequests}</h3>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Requests List */}
                    <div className="lg:col-span-1">
                        <Card className="h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl flex items-center justify-between">
                                    <span>Maintenance Requests</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                                        className="h-8"
                                    >
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Search and Filters */}
                                <div className="mb-4 space-y-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Search by name, ID or request number..."
                                            className="pl-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Building" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Buildings</SelectItem>
                                                <SelectItem value="A">Building A</SelectItem>
                                                <SelectItem value="B">Building B</SelectItem>
                                                <SelectItem value="C">Building C</SelectItem>
                                                <SelectItem value="D">Building D</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                <SelectItem value="electricity">Electricity</SelectItem>
                                                <SelectItem value="plumbing">Plumbing</SelectItem>
                                                <SelectItem value="carpentry">Carpentry</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Priorities</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                                        <Filter className="w-4 h-4 mr-2" /> Reset Filters
                                    </Button>
                                </div>

                                {/* Request List */}
                                <div className="space-y-3 mt-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((request) => (
                                            <div
                                                key={request.id}
                                                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedRequest?.id === request.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                                                    }`}
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center">
                                                        {getCategoryIcon(request.category)}
                                                        <span className="font-medium ml-2 text-gray-900">{request.id}</span>
                                                    </div>
                                                    {getStatusBadge(request.status)}
                                                </div>

                                                <div className="mb-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <User className="w-4 h-4 mr-1" />
                                                        <span>{request.name}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <Building className="w-4 h-4 mr-1" />
                                                        <span>
                                                            {getBuildingName(request.building)} - Room {request.roomNo}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center mt-2">
                                                    <div className="text-xs text-gray-500">{formatDate(request.dateSubmitted)}</div>
                                                    <div className="flex items-center">{getPriorityBadge(request.priority)}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                            <p>No maintenance requests found</p>
                                            <p className="text-sm">Try adjusting your filters</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Request Details */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            {selectedRequest ? (
                                <>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-xl flex items-center">
                                                <span>Request {selectedRequest.id}</span>
                                                <span className="ml-3">{getStatusBadge(selectedRequest.status)}</span>
                                            </CardTitle>
                                            <div className="text-sm text-gray-500">
                                                Submitted: {formatDate(selectedRequest.dateSubmitted)}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs defaultValue="details">
                                            <TabsList className="mb-4">
                                                <TabsTrigger value="details">Details</TabsTrigger>
                                                
                                                <TabsTrigger value="actions">Actions</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="details" className="space-y-6">
                                                {/* Student Information */}
                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">Student Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Name</p>
                                                            <p className="font-medium">{selectedRequest.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Student ID</p>
                                                            <p className="font-medium">{selectedRequest.studentId}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email</p>
                                                            <p className="font-medium">{selectedRequest.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Phone</p>
                                                            <p className="font-medium">{selectedRequest.phone || "Not provided"}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Building</p>
                                                            <p className="font-medium">{getBuildingName(selectedRequest.building)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Room Number</p>
                                                            <p className="font-medium">{selectedRequest.roomNo}</p>
                                                        </div>
                                                        <Button onClick={() => handlePrint(selectedRequest!)}>Print as PDF</Button>

                                                    </div>
                                                </div>

                                                {/* Issue Details */}
                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">Issue Details</h3>
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Category</p>
                                                                <div className="flex items-center mt-1">
                                                                    {getCategoryIcon(selectedRequest.category)}
                                                                    <p className="font-medium ml-1">{getCategoryName(selectedRequest.category)}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Priority</p>
                                                                <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Preferred Visit Time</p>
                                                                <p className="font-medium">
                                                                    {selectedRequest.visitTime === "morning" && "Morning (9:00 AM - 12:00 PM)"}
                                                                    {selectedRequest.visitTime === "afternoon" && "Afternoon (1:00 PM - 4:00 PM)"}
                                                                    {selectedRequest.visitTime === "evening" && "Evening (5:00 PM - 8:00 PM)"}
                                                                    {selectedRequest.visitTime === "any" && "Any Time"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Assigned To</p>
                                                                <p className="font-medium">{selectedRequest.assignedTo || "Not assigned"}</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="text-sm text-gray-500">Description</p>
                                                            <p className="mt-1 whitespace-pre-line">{selectedRequest.problem}</p>
                                                        </div>

                                                        {selectedRequest.hasImage && (
                                                            <div className="mt-4">
                                                                <p className="text-sm text-gray-500 mb-1">Attached Image</p>
                                                                <img
                                                                    src="/placeholder.svg?height=200&width=300"
                                                                    alt="Issue"
                                                                    className="rounded-lg border max-h-48 object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            
                                            <TabsContent value="actions" className="space-y-6">
                                                {/* Status Update */}
                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">Update Status</h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        <Button
                                                            variant={selectedRequest.status === "pending" ? "default" : "outline"}
                                                            onClick={() => updateStatus(selectedRequest.id, "pending")}
                                                            disabled={isLoading}
                                                        >
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Mark as Pending
                                                        </Button>
                                                        <Button
                                                            variant={selectedRequest.status === "in-progress" ? "default" : "outline"}
                                                            onClick={() => updateStatus(selectedRequest.id, "in-progress")}
                                                            disabled={isLoading}
                                                        >
                                                            <RefreshCw className="w-4 h-4 mr-2" />
                                                            Mark as In Progress
                                                        </Button>
                                                        <Button
                                                            variant={selectedRequest.status === "completed" ? "default" : "outline"}
                                                            onClick={() => updateStatus(selectedRequest.id, "completed")}
                                                            disabled={isLoading}
                                                        >
                                                            <CheckCheck className="w-4 h-4 mr-2" />
                                                            Mark as Completed
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Assign Staff */}
                                                <div>
                                                    <h3 className="text-lg font-medium mb-3">Assign Maintenance Staff</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {maintenanceStaff.map((staff) => (
                                                            <div
                                                                key={staff.id}
                                                                className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedRequest.assignedTo === staff.name
                                                                        ? "border-blue-500 bg-blue-50"
                                                                        : "border-gray-200 hover:border-blue-300"
                                                                    }`}
                                                                onClick={() => assignStaff(selectedRequest.id, staff.id)}
                                                            >
                                                                <div className="flex items-center">
                                                                    <Avatar className="h-8 w-8 mr-3">
                                                                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="font-medium">{staff.name}</p>
                                                                        <p className="text-xs text-gray-500">{staff.role}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-16">
                                    <div className="p-4 rounded-full bg-blue-100 mb-4">
                                        <Tool className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">No Request Selected</h3>
                                    <p className="text-gray-500 text-center max-w-md">
                                        Select a maintenance request from the list to view details and take action
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

