// User.ts
export enum Role {
    Admin = 0,
    User = 1,
    Guest = 2
}

export interface User {
    Id: number;
    UserName: string | null;
    Email: string | null;
    PasswordHash?: string | null;
    Role: Role; 
}

export interface Conference {
    Id: number; 
    Name: string; 
    Description?: string | null; 
    Genre?: string | null; 
    Location?: string | null; 
    StartDate: string; // ISO 8601 date-time
    EndDate: string; // ISO 8601 date-time
    Price: number; 
    Capacity: number; 
    Occupancy: number;
    Presentations?: Presentation[]; // Array of presentations
    Reservations?: Reservation[]; // Array of reservations
    Rooms?: Room[];
    OrganizerId: number; 
    Organizer: User; // Organizer details
}

export interface Presentation {
    Id: number; 
    Title?: string | null; 
    Description?: string | null; 
    Tags?: string | null; 
    PhotoUrl?: string | null; 
    StartTime: string; // ISO 8601 date-time
    EndTime: string; // ISO 8601 date-time
    RoomId: number; 
    Room: Room; // Room details
    SpeakerId: number; 
    Speaker: User; // Speaker details
    ConferenceId: number; 
}

export interface Reservation {
    Id: number; 
    UserId: number; 
    User: User; // User details
    ConferenceId: number;
    Conference: Conference;  // Conference datails
    IsConfirmed: boolean; 
    IsPaid: boolean; 
    NumberOfTickets: number;
    Ammount: number;
    ReservationDate: string; // ISO 8601 date-time
}

export interface Room {
    Id: number; 
    Name?: string | null; 
    Capacity: number;
    ConferenceId: number;
}
