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
    compnay_image: string;
    compnay_name: string;
    remaining_days: number;
    state: JobStatus
}

export interface UpdateJobReturnInterface {
    id: number;
}