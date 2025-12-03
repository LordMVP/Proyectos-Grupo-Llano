export interface PageableRequest {
    page: number;
    size: number;
    sort?:string | null;   
    search?:string | null;
    filter?:string | null;
}

export interface Pageable {
    sort:Sort;
    offset: number;
    pageSize: number;
    pageNumber: number;
    unpaged: boolean;
    paged: boolean;

}
export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;    
}
export default interface Page {
    content?: any[];
    pageable?:Pageable;
    last?:boolean;
    totalPages?:number;
    totalElements?:number;
    size?:number;
    number?:number;
    sort?:Sort;
}


export interface PageT<T> {
    content: T[];
    pageable?:Pageable;
    last?:boolean;
    totalPages?:number;
    totalElements:number;
    size?:number;
    number?:number;
    sort?:Sort;
}
