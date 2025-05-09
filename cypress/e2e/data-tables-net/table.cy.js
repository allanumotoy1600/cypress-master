/// <reference types="cypress" />

describe('DataTables Features - Rendering', () => {
    let tableValue;
    let totalEntries;

    beforeEach(() => {
        cy.visit('/');
    });

    it('Verify page loads successfully', () => {
        cy.url().should('include', `datatables`);
        cy.contains('a', 'DataTables');
    });

    it('Verify table loads successfully', () => {
        cy.get('div[class=hero-callout]').should('be.visible');
    });

    it('Verify table loads correct column number successfully', () => {
        cy.get('#example thead  tr  [data-dt-column]').should('have.length', 6);
    });

    it('Verify table search-bar load successfully', () => {
        cy.get('.dt-search > label').should('contain', 'Search:');
        cy.get('.dt-search > input').should('be.visible');
    });

    it('Verify table loads correct foot column number successfully', () => {
        cy.get('#example tfoot  tr  [data-dt-column]').should('have.length', 6);
    });

    it('Verify table loads correct row number initially successfully', () => {
        cy.get('select[class=dt-input]').invoke('val').then((value) => {
            tableValue = value;
            cy.log(tableValue);
        });
        cy.get('#example tbody tr').should('have.length', tableValue);
    });

    it('Verify table loads correct row number selected to 25 successfully', () => {
        cy.get('select[class=dt-input]').select('25').invoke('val').then((value) => {
            tableValue = value;
            cy.log(tableValue);
        });
        cy.get('#example tbody tr').should('have.length', tableValue);
    });

    it('Verify table loads correct row number selected to 50 successfully', () => {
        cy.get('select[class=dt-input]').select('50').invoke('val').then((value) => {
            tableValue = value;
            cy.log(tableValue);
        });
        cy.get('#example tbody tr').should('have.length', tableValue);
    });

    it('Verify table loads correct row number selected to 100 successfully', () => {
        cy.get('select[class=dt-input]').select('100');
        cy.get('#example tbody tr').its('length').then((totalEntries) => {
            cy.log(totalEntries);
            totalEntries = totalEntries;
        });
    });

    it('Verify table loads correct foot column info successfully', () => {
        let sumaTotalEntry;
        cy.get('select[class=dt-input]').invoke('val').then((value) => {
            tableValue = value;
            cy.log(tableValue);
        });
        cy.get('#example tbody tr').should('have.length', tableValue);
        cy.get('select[class=dt-input]').select('100');
        cy.get('#example tbody tr').its('length').then((totalEntries) => {
            cy.log(totalEntries);
            sumaTotalEntry = totalEntries;

            cy.get('select[class=dt-input]').select('10');
            cy.get('.dt-info').should('have.text', `Showing 1 to ${tableValue} of ${sumaTotalEntry} entries`);
        });
    });

    it('Verify table loads correct foot pagination successfully', () => {
        cy.get('.dt-paging > nav > button').should('have.length', 10);
    });

    it('Verify pagination functionality', () => {
        for (let page = 2; page <= 6; page++) {
            cy.get('.dt-paging > nav > button')
                .contains(page.toString())
                .click();

            cy.get('.dt-paging > nav > button')
                .contains(page.toString())
                .should('have.class', 'dt-paging-button current');
        }
    });

    it('Verify Name Search Functionality', () => {
        cy.get('input[class=dt-input').type('Tiger Nixon');
        cy.get('.dtr-control').should('have.text', 'Tiger Nixon');
    });

    it('Verify Position Search Functionality', () => {
        cy.get('input[class=dt-input]').type('Accountant');

        cy.get('#example tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(1).should('contain.text', 'Accountant');
        });
    });

    it('Verify Office Search Functionality', () => {
        cy.get('input[class=dt-input]').type('London');

        cy.get('#example tbody tr').each(($row) => {
            cy.wrap($row).find('td').eq(2).should('contain.text', 'London');
        });
    });

    it('Verify Numeric Search Functionality', () => {

        cy.get('input[class=dt-input]').type('33');

        cy.get('#example tbody tr').each(($row) => {
            cy.wrap($row).find('td').then(($cells) => {
                const column3 = $cells.eq(3).text(); 
                const column4 = $cells.eq(4).text(); 
                const column5 = $cells.eq(5).text(); 

               
                expect(
                    column3.includes('33') ||
                    column4.includes('33') ||
                    column5.includes('33')
                ).to.be.true;
            });
        });
    });


    it('Verify Name Sorting functionality', () => {    
        cy.contains('th', 'Name').click();
    
        cy.get('#example tbody tr td:first-child').then(($cells) => {
            const names = [...$cells].map(cell => cell.innerText.trim());    
            const sorted = [...names].sort((a, b) => b.localeCompare(a));
            expect(names).to.deep.equal(sorted);
        });
    
        cy.contains('th', 'Name').dblclick();

    
        cy.get('#example tbody tr td:first-child').then(($cells) => {
            const names = [...$cells].map(cell => cell.innerText.trim());
            const sorted = [...names].sort((a, b) => a.localeCompare(b));
            expect(names).to.deep.equal(sorted);
        });
    });

    it('Verify Position Sorting functionality', () => {    
        cy.contains('th', 'Position').click();
    
        cy.get('#example tbody tr td:nth-child(2)').then(($cells) => {
            const positions = [...$cells].map(cell => cell.innerText.trim());    
            const sorted = [...positions].sort((a, b) => a.localeCompare(b));
            expect(positions).to.deep.equal(sorted);
        });
    
        cy.contains('th', 'Position').click();

    
        cy.get('#example tbody tr td:nth-child(2)').then(($cells) => {
            const positions = [...$cells].map(cell => cell.innerText.trim());
            const sorted = [...positions].sort((a, b) => b.localeCompare(a));
            expect(positions).to.deep.equal(sorted);
        });
    });

    it('Verify Office Sorting functionality', () => {    
        cy.contains('th', 'Office').click();
    
        cy.get('#example tbody tr td:nth-child(3)').then(($cells) => {
            const Office = [...$cells].map(cell => cell.innerText.trim());    
            const sorted = [...Office].sort((a, b) => a.localeCompare(b));
            expect(Office).to.deep.equal(sorted);
        });
    
        cy.contains('th', 'Office').click();

    
        cy.get('#example tbody tr td:nth-child(3)').then(($cells) => {
            const Office = [...$cells].map(cell => cell.innerText.trim());
            const sorted = [...Office].sort((a, b) => b.localeCompare(a));
            expect(Office).to.deep.equal(sorted);
        });
    });

    it('Verify Age Sorting functionality', () => {    
        cy.contains('th', 'Age').click();
    
        cy.get('#example tbody tr td:nth-child(4)').then(($cells) => {
            const Age = [...$cells].map(cell => cell.innerText.trim());    
            const sorted = [...Age].sort((a,b) => a > b);
            expect(Age).to.deep.equal(sorted);
        });
    
        cy.contains('th', 'Age').click();
        cy.get('#example tbody tr td:nth-child(4)').then(($cells) => {
            const Age = [...$cells].map(cell => cell.innerText.trim());
            const sorted = [...Age].sort((a,b) => a < b);
            expect(Age).to.deep.equal(sorted);
        });
    });

    it.only('Verify Salary Sorting functionality', () => {  
        cy.viewport(800, 844)  
        cy.contains('th', 'Salary').click();
    
        cy.get('#example tbody tr td:nth-child(5)').then(($cells) => {
            const Salary = [...$cells].map(cell => cell.innerText.trim());    
            const sorted = [...Salary].sort((a,b) => a > b);
            expect(Salary).to.deep.equal(sorted);
        });
    
        cy.contains('th', 'Salary').click();
        cy.get('#example tbody tr td:nth-child(5)').then(($cells) => {
            const Salary = [...$cells].map(cell => cell.innerText.trim());
            const sorted = [...Salary].sort((a,b) => a < b);
            expect(Salary).to.deep.equal(sorted);
        });
    });

});
