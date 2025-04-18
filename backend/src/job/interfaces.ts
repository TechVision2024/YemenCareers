import { JobStatus } from "./enums/job-status.enum";

export interface JobInformaionInterface {
    title: string;
    body: string;
    type: string;
    department: string;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    city: string;
    apply_url: string;
    company_image: string;
    company_name: string;
    remaining_days: number;
    status: JobStatus
}

export interface UpdateJobReturnInterface {
    id: number;
}

export interface YourJobInterface {
    title: string;
    type: string;
    department: string;
    end_date: Date;
    created_at: Date;
    city: string;
    company_image: string;
    remaining_days: number;
    status: JobStatus
}

export interface SearchJobInterface extends YourJobInterface {
    company_name: string;
}