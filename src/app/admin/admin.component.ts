import { Component } from '@angular/core';
import { CategoryService } from '../shared/category.service';

@Component({
    moduleId: module.id,
    selector: 'admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent {
    title = 'Manage Categories';
    currentUser = localStorage.getItem('uname');
    categoryname: String;
    subcategoryname: String;
    oldcategoryname: String;
    categories: any[] = [];
    rootCategories: any[] = [];
    subCategories: any[] = [];
    pathCategories: any[] = [];

    constructor(private categoryService: CategoryService) {
        this.categoryService.getRootCategory()
            .subscribe(data => {
                if (data.length) {
                    this.categories = data;
                    this.rootCategories = data;
                }
            });
    }

    createNewCategory() {
        let cName = this.categoryname
        this.categoryService.addRootCategory(cName)

            .subscribe(data => {
                if (data.success) {
                    this.categoryname = null;
                    this.categories.push(data.categories);
                    this.rootCategories.push(data.categories);
                }
            });
    };

    createNewSubCategory(category) {
        let subCName = category.subcategoryname;
        let parent = category.categoryname
        this.categoryService.addSubCategory(parent, subCName)

            .subscribe(data => {
                if (data.success) {
                    category.subcategoryname = null;
                }
            });
    };

    getSubCategories(category) {
        let id = category._id;
        this.populatePath(category);
        this.categoryService.getSubCategory(id)

            .subscribe(data => {
                if (data) {
                    this.subCategories = data.childcategories;
                    this.categories = this.subCategories;
                }
            });
    };

    removeCategory(ct, index) {
        if (ct) {
            let categoryname = ct.categoryname;
            let id = ct._id;
            this.categoryService.removeCategory(categoryname, id)

                .subscribe(data => {
                    if (data.success) {
                        this.categories.splice(index, 1);
                        console.log('Deleted Successfully');
                    }
                });
        }
    }

    toggleUpdate(ct, index) {
        if (ct.isEdit) {
            this.categories[index].isEdit = false;
            this.oldcategoryname = "";
        } else {
            this.categories[index].isEdit = true;
            this.oldcategoryname = ct.categoryname
        }
    }

    editCategory(ct, index) {
        if (ct) {
            let category = { newcategoryname: ct.categoryname, oldcategoryname: this.oldcategoryname };
            let id = ct._id;
            this.categoryService.updateCategory(category, id)

                .subscribe(data => {
                    if (data.success) {
                        this.categories[index] = ct.categoryname;
                        ct.isEdit = false;
                        this.oldcategoryname = "";
                        console.log('Updated Successfully');
                    }
                });
        }
    }

    populatePath(ct) {
        let selectedCategory = this.pathCategories.find(item => item.categoryname === ct.categoryname);
        if (selectedCategory) {
            let index = this.pathCategories.findIndex(item => item.categoryname === ct.categoryname);
            this.pathCategories.splice(index + 1, this.pathCategories.length - index);
        } else {
            this.pathCategories.push(ct);
        }
    }

    populateRootCategories() {
        this.categories = this.rootCategories;
        this.pathCategories = [];
    }
}

