export class Pagination {
	protected iCurrentPage: number;

	protected iPageSize: number;

	protected iTotalRecords: number;

	protected iTotalPages: number;

	public constructor(currentPage: number, pageSize: number, totalRecords: number) {
		this.iCurrentPage = currentPage;
		this.iPageSize = pageSize;
		this.iTotalRecords = totalRecords;
		this.iTotalPages = Math.ceil(this.iTotalRecords / this.iPageSize) || 1;
	}

	public get pages(): Array<number | string> {
		let ret: Array<number | string> = [1];
		let middlePage = this.iCurrentPage;
		if (this.iCurrentPage === 1) {
			middlePage = 2;
		}
		if (this.iCurrentPage === this.iTotalPages && this.iTotalPages > 2) {
			middlePage = this.iTotalPages - 1;
		}
		if (middlePage > 3 && this.iTotalPages > 4) {
			ret.push('...');
		}
		ret = [
			...ret,
			...[middlePage - 1, middlePage, middlePage + 1].filter(
				(pageNumber) => pageNumber !== 1 && pageNumber < this.iTotalPages,
			),
		];
		if (middlePage + 1 < this.iTotalPages - 1) {
			ret.push('...');
		}
		if (this.iTotalPages !== 1) {
			ret.push(this.iTotalPages);
		}

		return ret;
	}

	public get recordsLow(): number {
		return this.iPageSize * (this.iCurrentPage - 1) + 1;
	}

	public get recordsHigh(): number {
		return this.recordsLow + this.iPageSize - 1 > this.iTotalRecords
			? this.iTotalRecords
			: this.recordsLow + this.iPageSize - 1;
	}

	public get showPrevButton(): boolean {
		return this.iCurrentPage !== 1;
	}

	public get showNextButton(): boolean {
		return this.iCurrentPage !== this.iTotalPages;
	}
}

export default Pagination;
