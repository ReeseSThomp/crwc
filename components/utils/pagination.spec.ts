import Pagination from './pagination';

describe('pagination', () => {
	it('pages correctly determined', () => {
		expect.hasAssertions();

		const paginationZero = new Pagination(1, 25, 0);
		expect(paginationZero.pages).toStrictEqual([1]);
		expect(paginationZero.showPrevButton).toBeFalsy();
		expect(paginationZero.showNextButton).toBeFalsy();

		const pagination1 = new Pagination(1, 25, 1);
		expect(pagination1.pages).toStrictEqual([1]);
		expect(pagination1.showPrevButton).toBeFalsy();
		expect(pagination1.showNextButton).toBeFalsy();

		const pagination2 = new Pagination(1, 25, 50);
		expect(pagination2.pages).toStrictEqual([1, 2]);
		expect(pagination2.showNextButton).toBeTruthy();

		const twoPages = new Pagination(1, 25, 50);
		expect(twoPages.pages).toStrictEqual([1, 2]);

		const twoPagesSecondPage = new Pagination(2, 25, 50);
		expect(twoPagesSecondPage.pages).toStrictEqual([1, 2]);

		const threePages = new Pagination(1, 25, 75);
		expect(threePages.pages).toStrictEqual([1, 2, 3]);

		const threePagesSecondPage = new Pagination(2, 25, 75);
		expect(threePagesSecondPage.pages).toStrictEqual([1, 2, 3]);

		const threePagesThirdPage = new Pagination(3, 25, 75);
		expect(threePagesThirdPage.pages).toStrictEqual([1, 2, 3]);

		const pagination3 = new Pagination(1, 25, 100);
		expect(pagination3.pages).toStrictEqual([1, 2, 3, 4]);

		const pagination4 = new Pagination(1, 25, 125);
		expect(pagination4.pages).toStrictEqual([1, 2, 3, '...', 5]);

		const pagination5 = new Pagination(4, 25, 125);
		expect(pagination5.pages).toStrictEqual([1, '...', 3, 4, 5]);

		const pagination6 = new Pagination(2, 25, 150);
		expect(pagination6.pages).toStrictEqual([1, 2, 3, '...', 6]);

		const pagination7 = new Pagination(4, 25, 150);
		expect(pagination7.pages).toStrictEqual([1, '...', 3, 4, 5, 6]);

		const pagination8 = new Pagination(4, 25, 175);
		expect(pagination8.pages).toStrictEqual([1, '...', 3, 4, 5, '...', 7]);

		const pagination9 = new Pagination(7, 25, 175);
		expect(pagination9.pages).toStrictEqual([1, '...', 5, 6, 7]);
	});
});
