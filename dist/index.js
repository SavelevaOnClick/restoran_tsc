"use strict";
class Position {
    constructor(dataPosition) {
        this.id = dataPosition.id;
        this.title = dataPosition.title;
    }
}
class Employee {
    constructor(dataEmployee) {
        this.id = dataEmployee.id;
        this.name = dataEmployee.name;
        this.surname = dataEmployee.surname;
        this.patronomic = dataEmployee.patronomic;
        this.salary = dataEmployee.salary;
        this.status = dataEmployee.status;
        this.position = dataEmployee.position;
    }
}
class Department {
    constructor(dataDepartment) {
        this.id = dataDepartment.id;
        this.title = dataDepartment.title;
        this.employeers = [];
    }
    addEmployee(dataEmployee) {
        this.employeers.push(dataEmployee);
    }
    deleteEmployee(id) {
        this.employeers.splice(this.findIndexEmployee(id), 1);
    }
    etitEmployee(id, dataEmployee) {
        this.employeers.splice(this.findIndexEmployee(id), 1, dataEmployee);
    }
    findIndexEmployee(id) {
        let index = -1;
        for (let i = 0; i < this.employeers.length; i++) {
            if (this.employeers[i].id !== id) {
                continue;
            }
            index = i;
        }
        return index;
        // return this.employeers.findIndex((employee) => {
        //   return employee.id === id;
        // });
    }
    getSalarys(status) {
        let salarys = 0;
        for (let employeer of this.employeers) {
            if (employeer.status === status) {
                salarys += employeer.salary;
            }
        }
        return salarys;
    }
    getMeanSalary(status) {
        let salary = 0;
        let counter = 0;
        for (let employee of this.employeers) {
            if (employee.status === status) {
                salary += employee.salary;
                ++counter;
            }
        }
        return counter > 0 ? salary / counter : 0;
    }
    getAmountDismissedEmployee() {
        let counter = 0;
        for (let employee of this.employeers) {
            !employee.status && ++counter;
        }
        return counter;
    }
    getExtremumSalary(extremum) {
        if (extremum !== "min" && extremum !== "max") {
            throw new Error("Not correct data");
        }
        return this.employeers
            .map((employee) => {
            return employee.salary;
        })
            .sort(extremum === "min" ? this.sortMin : this.sortMax)[0];
    }
    sortMin(elementFirst, elementSecond) {
        return elementFirst - elementSecond;
    }
    sortMax(elementFirst, elementSecond) {
        return elementSecond - elementFirst;
    }
    getExtremumSalaryByPosition(extremum, position) {
        if (extremum !== "min" && extremum !== "max") {
            throw new Error("Not correct data");
        }
        const salarys = [];
        for (let employee of this.employeers) {
            employee.position === position && salarys.push(employee.salary);
            console.log(salarys, "look");
        }
        const sortSalarys = salarys.sort(extremum === "min" ? this.sortMin : this.sortMax);
        return sortSalarys.length > 0 ? sortSalarys[0] : 0;
    }
    isPosition(position) {
        for (let employee of this.employeers) {
            if (employee.position === position) {
                return true;
            }
        }
        return false;
    }
}
class Restourant {
    constructor() {
        this.idCounter = 13;
        this.departments = [];
        this.positions = [];
    }
    addDepartment(dataDepartment) {
        this.departments.push(dataDepartment);
    }
    addPsition(position) {
        this.positions.push(position);
    }
}
class RestorantCalculation {
    constructor(dataRestourant) {
        this.departments = dataRestourant.departments;
        this.positions = dataRestourant.positions;
    }
    getSalarysDepartments(status) {
        const statisticSalary = {};
        for (let department of this.departments) {
            const sum = department.getSalarys(status);
            statisticSalary[department.id] = sum;
        }
        return statisticSalary;
    }
    getMeanSalarysDepartments(status) {
        const statisticSalary = {};
        for (let department of this.departments) {
            const sum = department.getMeanSalary(status);
            statisticSalary[department.id] = sum.toFixed(2);
        }
        return statisticSalary;
    }
    getAmountDismissedEmployees() {
        let counter = 0;
        for (let department of this.departments) {
            counter += department.getAmountDismissedEmployee();
        }
        return counter;
    }
    getExtremumSalarysDepartments(extremum) {
        if (extremum !== "min" && extremum !== "max") {
            throw new Error("Not correct data");
        }
        const result = {};
        for (let department of this.departments) {
            result[department.id] = department.getExtremumSalary(extremum);
        }
        return result;
    }
    getExtremumSalarysDepartmentsByPosition(extremum) {
        if (extremum !== "min" && extremum !== "max") {
            throw new Error("Not correct data");
        }
        const result = {};
        for (let position of this.positions) {
            const salarys = [];
            for (let department of this.departments) {
                salarys.push(department.getExtremumSalaryByPosition(extremum, position.id));
            }
            result[position.title] = salarys.sort(extremum === "min" ? this.sortMin : this.sortMax)[0];
        }
        return result;
    }
    getDepartmentsWithoutPosition(position) {
        const departments = [];
        for (let department of this.departments) {
            !department.isPosition(position) && departments.push(department.title);
        }
        return departments;
    }
    sortMin(elementFirst, elementSecond) {
        return elementFirst - elementSecond;
    }
    sortMax(elementFirst, elementSecond) {
        return elementSecond - elementFirst;
    }
    findPosition(id) {
        return this.positions.findIndex((position) => {
            return position.id === id;
        });
    }
    findIndexDepartment(id) {
        return this.departments.findIndex((department) => {
            return department.id === id;
        });
    }
    findIndexPosition(id) {
        return this.positions.findIndex((position) => {
            return position.id === id;
        });
    }
}
class RestoranRender {
    constructor(dataRestourant, restorantCalculation, container) {
        this.countId = dataRestourant.idCounter;
        this.departments = dataRestourant.departments;
        this.positions = dataRestourant.positions;
        this.calculation = restorantCalculation;
        this.modal = this.createModal();
        document.body.append(this.modal);
        this.employeeList = this.createElement("div", {
            className: "employeeList",
        });
        this.renderEmployeesList();
        this.mainRender(container);
    }
    mainRender(container) {
        const wrapperInforBlock = this.createElement("div", {
            className: "info-Block",
        });
        const addEmployeeBtn = this.createButton({
            type: "button",
            className: "add-btn",
            innerText: "???????????????? ???????????? ????????????????????",
        });
        addEmployeeBtn.onclick = this.addEmployeeOnclick.bind(this);
        document.body.append(addEmployeeBtn);
        const allSalaryBlock = this.renderAllSalaryBlock();
        const meanSalaryBlock = this.renderMeanSalaryBlock();
        const extremumSalaryBlock = this.renderExtremumSalaryBlock();
        const extremumSalaryPositionBlock = this.renderExtremumSalaryPositionBlock();
        const dismissedBlock = this.renderDismissedBlock();
        const findDepartmentWithoutPositionBlock = this.renderFindDepartmentWithoutPositionBlock();
        const wrapperEmployeeCard = this.createElement("div", {
            className: "wrapper",
        });
        wrapperInforBlock.append(allSalaryBlock, meanSalaryBlock, extremumSalaryBlock, extremumSalaryPositionBlock, dismissedBlock, findDepartmentWithoutPositionBlock);
        container.append(wrapperInforBlock, wrapperEmployeeCard);
        wrapperEmployeeCard.append(this.employeeList);
    }
    createModal() {
        const modal = this.createElement("div", {
            className: "modal",
        });
        return modal;
    }
    renderAllSalaryBlock() {
        const block = this.createElement("div", {
            className: "info-content",
        });
        const title = this.createElement("h2", {
            className: "info-title",
            innerText: "?????????????????? ????????????????:",
        });
        const getResult = this.createButton({
            type: "button",
            className: "result-btn",
            innerText: "????????????????",
        });
        const selectStatus = this.createSelect({
            "1": "????????????????????",
            "0": "??????????????????",
        }, {
            className: "info-select",
        });
        const outputBlock = this.createElement("p", {
            className: "output",
        });
        block.append(title, getResult, selectStatus, outputBlock);
        getResult.onclick = this.getAllSalaryOnclik.bind(this, selectStatus, outputBlock);
        return block;
    }
    renderMeanSalaryBlock() {
        const block = this.createElement("div", {
            className: "info-content",
        });
        const getResult = this.createButton({
            type: "button",
            className: "result-btn",
            innerText: "????????????????",
        });
        const selectStatus = this.createSelect({
            "1": "????????????????????",
            "0": "??????????????????",
        }, {
            className: "info-select",
        });
        const title = this.createElement("h2", {
            className: "info-title",
            innerText: "?????????????? ???????????????? ???? ??????????????:",
        });
        const outputBlock = this.createElement("p", {
            className: "output",
        });
        getResult.onclick = this.getMeanSalarysOnclik.bind(this, selectStatus, outputBlock);
        block.append(title, getResult, selectStatus, outputBlock);
        return block;
    }
    renderExtremumSalaryBlock() {
        const block = this.createElement("div", {
            className: "info-content",
        });
        const getResult = this.createButton({
            type: "button",
            className: "result-btn",
            innerText: "????????????????",
        });
        const title = this.createElement("h2", {
            className: "info-title",
            innerText: "????????????????????????/?????????????????????? ???? ??????????????:",
        });
        const selectExtremum = this.createSelect({
            max: "????????????????????????",
            min: "??????????????????????",
        }, {
            className: "info-select",
        });
        const outputBlock = this.createElement("p", {
            className: "output",
        });
        block.append(title, getResult, selectExtremum, outputBlock);
        getResult.onclick = this.getExtremumSalarysOnclik.bind(this, selectExtremum, outputBlock);
        return block;
    }
    renderExtremumSalaryPositionBlock() {
        const block = this.createElement("div", {
            className: "info-content",
        });
        const title = this.createElement("h2", {
            className: "info-title",
            innerText: "????????????????????????/?????????????????????? ???? ????????????????:",
        });
        const getResult = this.createButton({
            type: "button",
            className: "result-btn",
            innerText: "????????????????",
        });
        const selectExtremum = this.createSelect({
            max: "????????????????????????",
            min: "??????????????????????",
        }, {
            className: "info-select",
        });
        const outputBlock = this.createElement("p", {
            className: "output",
        });
        block.append(title, getResult, selectExtremum, outputBlock);
        getResult.onclick = this.getExtremumSalarysByPositionOnclik.bind(this, selectExtremum, outputBlock);
        return block;
    }
    renderDismissedBlock() {
        const block = this.createElement("div", {
            className: "info-content",
        });
        const title = this.createElement("h2", {
            className: "info-title",
            innerText: "???????????????????? ??????????????????:",
        });
        const getResult = this.createButton({
            type: "button",
            className: "result-btn",
            innerText: "????????????????",
        });
        const outputBlock = this.createElement("p", {
            className: "output",
        });
        block.append(title, getResult, outputBlock);
        getResult.onclick = this.getAmountDismissedEmployeeOnclik.bind(this, outputBlock);
        return block;
    }
    renderFindDepartmentWithoutPositionBlock() {
        const block = this.createElement("div", {
            className: "info-content",
        });
        const getResult = this.createButton({
            type: "button",
            className: "result-btn",
            innerText: "????????????????",
        });
        const selectPosition = this.createSelect(this.createPositionList(), {
            className: "info-block",
        });
        const outputBlock = this.createElement("p", {
            className: "output",
        });
        const title = this.createElement("h2", {
            className: "info-title",
            innerText: "???????????? ?????? ??????????????:",
        });
        block.append(title, getResult, selectPosition, outputBlock);
        getResult.onclick = this.getDepartmentWithoutPositionOnclick.bind(this, selectPosition, outputBlock);
        return block;
    }
    getDepartmentWithoutPositionOnclick(selectPosition, outputBlock, event) {
        event.preventDefault();
        outputBlock.innerHTML = "";
        const position = Number(this.getSelectValue(selectPosition));
        outputBlock.innerHTML = String(this.calculation.getDepartmentsWithoutPosition(position));
    }
    getAmountDismissedEmployeeOnclik(outputBlock, event) {
        event.preventDefault();
        outputBlock.innerHTML = "";
        outputBlock.innerHTML = String(this.calculation.getAmountDismissedEmployees());
    }
    getExtremumSalarysByPositionOnclik(selectExtremum, outputBlock, event) {
        outputBlock.innerHTML = "";
        event.preventDefault();
        const extremum = this.getSelectValue(selectExtremum);
        const resultSalarys = this.calculation.getExtremumSalarysDepartmentsByPosition(extremum);
        for (let department in resultSalarys) {
            outputBlock.innerHTML += `${department}: ${resultSalarys[department].toFixed(2)}   `;
        }
    }
    getExtremumSalarysOnclik(selectExtremum, outputBlock, event) {
        outputBlock.innerHTML = "";
        event.preventDefault();
        const extremum = this.getSelectValue(selectExtremum);
        const resultSalarys = this.calculation.getExtremumSalarysDepartments(extremum);
        for (let department in resultSalarys) {
            outputBlock.innerHTML += `${department}: ${resultSalarys[department].toFixed(2)}   `;
        }
    }
    getMeanSalarysOnclik(select, outputBlock, event) {
        outputBlock.innerHTML = "";
        event.preventDefault();
        const status = Boolean(Number(this.getSelectValue(select)));
        const resultSalarys = this.calculation.getMeanSalarysDepartments(status);
        for (let department in resultSalarys) {
            outputBlock.innerHTML += `${department}: ${resultSalarys[department]}`;
        }
    }
    getAllSalaryOnclik(select, outputBlock, event) {
        outputBlock.innerHTML = "";
        event.preventDefault();
        const status = Boolean(Number(this.getSelectValue(select)));
        const resultSalarys = this.calculation.getSalarysDepartments(status);
        for (let department in resultSalarys) {
            outputBlock.innerHTML += `${department}: ${resultSalarys[department].toFixed(2)}   `;
        }
    }
    renderEmployeesList() {
        this.employeeList.innerHTML = "";
        for (let department of this.departments) {
            for (let employee of department.employeers) {
                this.employeeList.innerHTML += this.createEmployeeCard(employee, department.id);
            }
        }
        this.employeeList.onclick = this.handleClick.bind(this);
    }
    addEmployeeOnclick(event) {
        event.preventDefault();
        console.log("fsdfds");
        this.modal.append(this.createForm());
        this.modal.classList.add("active");
    }
    handleClick(event) {
        const dataAtribbute = event.target.getAttribute("data-action");
        if (dataAtribbute) {
            event.preventDefault();
            const temp = event.target.closest("div.card");
            const idEmployee = Number(temp.getAttribute("data-id"));
            const idDepartment = Number(temp.getAttribute("data-idDep"));
            const indexDepartment = this.calculation.findIndexDepartment(idDepartment);
            dataAtribbute === "delete"
                ? this.deleteEmployee(idEmployee, indexDepartment)
                : this.editEmployee(idEmployee, indexDepartment);
        }
    }
    deleteEmployee(idEmployee, indexDepartment) {
        this.departments[indexDepartment].deleteEmployee(idEmployee);
        this.renderEmployeesList();
    }
    editEmployee(idEmployee, indexDepartment) {
        const indexEmployee = this.departments[indexDepartment].findIndexEmployee(idEmployee);
        this.modal.append(this.createForm(this.departments[indexDepartment].employeers[indexEmployee], indexDepartment));
        this.modal.classList.add("active");
    }
    createEmployeeCard(dataEmployee, idDepartment) {
        const indexDepartment = this.calculation.findIndexDepartment(idDepartment);
        const position = this.calculation.findIndexPosition(dataEmployee.position);
        return `<div class="card" data-id="${dataEmployee.id}" data-idDep="${idDepartment}">
      <p class="cardInfo">??????: ${dataEmployee.name}</p>
      <p class="cardInfo">??????????????: ${dataEmployee.surname}</p>
      <p class="cardInfo">????????????????: ${dataEmployee.patronomic}</p>
      <p class="cardInfo info-content">
        <span>????????????????: ${dataEmployee.salary}</span>
        <span>????????????: ${dataEmployee.status ? "????????????????" : "????????????"}</span>
        <span>??????????????: ${this.positions[position].title}</span>
        <span>??????????????????????: ${this.departments[indexDepartment].title}</span>
      </p>
      <div class="wrapperBtnCard">
        <button class="cardBtn" data-action="delete">??????????????</button>
        <button class="cardBtn" data-action="edit">??????????????????????????</button>
      </div>
    </div>    `;
    }
    createElement(type, props) {
        const element = document.createElement(type);
        Object.assign(element, props);
        return element;
    }
    createForm(dataEmployee, indexDepartment) {
        const form = this.createElement("form", {
            method: "POST",
            action: "#",
            className: "employeeForm",
        });
        form.innerHTML = `
    <input type="text" name="name" placeholder="??????" value="${dataEmployee ? dataEmployee.name : ""}" />
    <input
      type="text"
      placeholder="??????????????"
      name="surname"
      value="${dataEmployee ? dataEmployee.surname : ""}"
    />
    <input
      type="text"
      placeholder="????????????????"
      name="patronomic"
      value="${dataEmployee ? dataEmployee.patronomic : ""}"
    />
    <input type="number" placeholder="0" name="salary" value="${dataEmployee ? dataEmployee.salary : ""}"/>
    `;
        const selectDepartment = this.createSelect(this.createDapertmentList(), {
            name: "departmentId",
        });
        const selectPosition = this.createSelect(this.createPositionList(), {
            name: "position",
            className: "select",
        });
        const status = `
      <p>${dataEmployee?.status}</p>
    `;
        form.append(selectDepartment, selectPosition);
        dataEmployee && form.append(`${status}`);
        const submitForm = this.createButton({
            type: "submit",
            className: "submit",
            innerText: "send",
        });
        form.append(submitForm);
        const id = dataEmployee?.id || 0;
        if (typeof indexDepartment === "number") {
            this.departments[indexDepartment].deleteEmployee(id);
        }
        submitForm.onclick = this.sendData.bind(this, id);
        return form;
    }
    createPositionList() {
        const result = {};
        for (let position of this.positions) {
            result[position.id] = position.title;
        }
        return result;
    }
    sendData(id, event) {
        event.preventDefault();
        const form = this.modal.querySelector("form");
        const formData = new FormData(form);
        const dataEmployee = new Employee({
            name: String(formData.get("name")),
            surname: String(formData.get("surname")),
            patronomic: String(formData.get("patronomic")),
            salary: Number(formData.get("salary")),
            status: true,
            id: Number(id > 0 ? id : ++this.countId),
            position: Number(formData.get("position")),
        });
        const idDepartment = Number(formData.get("departmentId"));
        const indexDepartment = this.calculation.findIndexDepartment(idDepartment);
        this.departments[indexDepartment].addEmployee(dataEmployee);
        form.remove();
        this.modal.classList.toggle("active");
        this.renderEmployeesList();
    }
    createDapertmentList() {
        const departmentList = {};
        this.departments.forEach((department) => {
            departmentList[department.id] = department.title;
        });
        return departmentList;
    }
    createButton(props) {
        const button = document.createElement("button");
        Object.assign(button, props);
        return button;
    }
    createSelect(parameters, props) {
        const select = document.createElement("select");
        for (let parameter in parameters) {
            select.append(new Option(parameters[parameter], parameter));
        }
        for (let prop in props) {
            select.setAttribute(prop, props[prop]);
        }
        // Object.assign(select, props);
        return select;
    }
    getSelectValue(select) {
        let indexSelect = select.options.selectedIndex;
        let valueSelect = select.options[indexSelect].value;
        return valueSelect;
    }
}
const restourant = new Restourant();
restourant.addPsition({
    id: 1,
    title: "????????????????????????",
});
restourant.addPsition({
    id: 2,
    title: "??????????",
});
restourant.addPsition({
    id: 3,
    title: "????????????????",
});
restourant.addPsition({
    id: 4,
    title: "??????????????????",
});
restourant.addPsition({
    id: 4,
    title: "??????????????",
});
const first = new Department({
    id: 1,
    title: "????????????-????????????????",
});
const second = new Department({
    id: 2,
    title: "??????-??????????????????",
});
restourant.addDepartment(first);
restourant.addDepartment(second);
restourant.departments[0].addEmployee(new Employee({
    id: 1,
    name: "????????",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 3000,
    status: true,
}));
restourant.departments[0].addEmployee(new Employee({
    id: 2,
    name: "????????",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 2000,
    status: false,
}));
restourant.departments[0].addEmployee(new Employee({
    id: 3,
    name: "????????????",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 1000,
    status: true,
}));
restourant.departments[1].addEmployee(new Employee({
    id: 4,
    name: "John",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 3000,
    status: true,
}));
restourant.departments[1].addEmployee(new Employee({
    id: 5,
    name: "????????",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 2000,
    status: true,
}));
restourant.departments[1].addEmployee(new Employee({
    id: 6,
    name: "??????????",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 1000,
    status: false,
}));
const result = new RestorantCalculation(restourant);
const render = new RestoranRender(restourant, result, document.querySelector("#root"));
