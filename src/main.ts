interface Employee {
  name: string;
  surname: string;
  patronomic: string;
  salary: number;
  status: boolean;
  position: number;
  id: number;
}
interface Dep {
  id: number;
  title: string;
}
interface Position {
  id: number;
  title: string;
}
class Position implements Position {
  id: number;
  title: string;
  constructor(dataPosition: Position) {
    this.id = dataPosition.id;
    this.title = dataPosition.title;
  }
}

class Employee {
  name: string;
  surname: string;
  patronomic: string;
  position: number;
  salary: number;
  status: boolean;
  constructor(dataEmployee: Employee) {
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
  id: number;
  title: string;
  employeers: Employee[];
  constructor(dataDepartment: Dep) {
    this.id = dataDepartment.id;
    this.title = dataDepartment.title;
    this.employeers = [];
  }
  addEmployee(dataEmployee: Employee): void {
    this.employeers.push(dataEmployee);
  }
  deleteEmployee(id: number): void {
    this.employeers.splice(this.findIndexEmployee(id), 1);
  }
  etitEmployee(id: number, dataEmployee: Employee): void {
    this.employeers.splice(this.findIndexEmployee(id), 1, dataEmployee);
  }
  findIndexEmployee(id: number): number {
    let index: number = -1;
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
  getSalarys(status: boolean): number {
    let salarys: number = 0;
    for (let employeer of this.employeers) {
      if (employeer.status === status) {
        salarys += employeer.salary;
      }
    }
    return salarys;
  }
  getMeanSalary(status: boolean): number {
    let salary: number = 0;
    let counter: number = 0;
    for (let employee of this.employeers) {
      if (employee.status === status) {
        salary += employee.salary;
        ++counter;
      }
    }
    return counter > 0 ? salary / counter : 0;
  }
  getAmountDismissedEmployee(): number {
    let counter: number = 0;
    for (let employee of this.employeers) {
      !employee.status && ++counter;
    }
    return counter;
  }
  getExtremumSalary(extremum: string): number {
    if (extremum !== "min" && extremum !== "max") {
      throw new Error("Not correct data");
    }
    return this.employeers
      .map((employee) => {
        return employee.salary;
      })
      .sort(extremum === "min" ? this.sortMin : this.sortMax)[0];
  }
  sortMin(elementFirst: number, elementSecond: number): number {
    return elementFirst - elementSecond;
  }
  sortMax(elementFirst: number, elementSecond: number): number {
    return elementSecond - elementFirst;
  }
  getExtremumSalaryByPosition(extremum: string, position: number): number {
    if (extremum !== "min" && extremum !== "max") {
      throw new Error("Not correct data");
    }
    const salarys: number[] = [];
    for (let employee of this.employeers) {
      employee.position === position && salarys.push(employee.salary);
      console.log(salarys, "look");
    }
    const sortSalarys: number[] = salarys.sort(
      extremum === "min" ? this.sortMin : this.sortMax
    );
    return sortSalarys.length > 0 ? sortSalarys[0] : 0;
  }
  isPosition(position: number): boolean {
    for (let employee of this.employeers) {
      if (employee.position === position) {
        return true;
      }
    }
    return false;
  }
}
class Restourant {
  departments: Department[];
  positions: Position[];
  idCounter: number;
  constructor() {
    this.idCounter = 13;
    this.departments = [];
    this.positions = [];
  }
  addDepartment(dataDepartment: Department) {
    this.departments.push(dataDepartment);
  }
  addPsition(position: Position): void {
    this.positions.push(position);
  }
}
class RestorantCalculation {
  departments;
  positions;
  constructor(dataRestourant: Restourant) {
    this.departments = dataRestourant.departments;
    this.positions = dataRestourant.positions;
  }
  getSalarysDepartments(status: boolean): Record<number, number> {
    const statisticSalary: Record<number, number> = {};
    for (let department of this.departments) {
      const sum = department.getSalarys(status);
      statisticSalary[department.id] = sum;
    }
    return statisticSalary;
  }
  getMeanSalarysDepartments(status: boolean): Record<number, string> {
    const statisticSalary: Record<number, string> = {};
    for (let department of this.departments) {
      const sum = department.getMeanSalary(status);
      statisticSalary[department.id] = sum.toFixed(2);
    }
    return statisticSalary;
  }
  getAmountDismissedEmployees(): number {
    let counter: number = 0;
    for (let department of this.departments) {
      counter += department.getAmountDismissedEmployee();
    }
    return counter;
  }
  getExtremumSalarysDepartments(extremum: string): Record<number, number> {
    if (extremum !== "min" && extremum !== "max") {
      throw new Error("Not correct data");
    }
    const result: Record<number, number> = {};
    for (let department of this.departments) {
      result[department.id] = department.getExtremumSalary(extremum);
    }
    return result;
  }
  getExtremumSalarysDepartmentsByPosition(
    extremum: string
  ): Record<string, number> {
    if (extremum !== "min" && extremum !== "max") {
      throw new Error("Not correct data");
    }
    const result: Record<string, number> = {};
    for (let position of this.positions) {
      const salarys: number[] = [];
      for (let department of this.departments) {
        salarys.push(
          department.getExtremumSalaryByPosition(extremum, position.id)
        );
      }
      result[position.title] = salarys.sort(
        extremum === "min" ? this.sortMin : this.sortMax
      )[0];
    }
    return result;
  }
  getDepartmentsWithoutPosition(position: number): string[] {
    const departments: string[] = [];
    for (let department of this.departments) {
      !department.isPosition(position) && departments.push(department.title);
    }
    return departments;
  }
  sortMin(elementFirst: number, elementSecond: number): number {
    return elementFirst - elementSecond;
  }
  sortMax(elementFirst: number, elementSecond: number): number {
    return elementSecond - elementFirst;
  }
  findPosition(id: number): number {
    return this.positions.findIndex((position) => {
      return position.id === id;
    });
  }
  findIndexDepartment(id: number): number {
    return this.departments.findIndex((department) => {
      return department.id === id;
    });
  }
  findIndexPosition(id: number): number {
    return this.positions.findIndex((position) => {
      return position.id === id;
    });
  }
}
class RestoranRender {
  departments;
  positions;
  calculation;
  employeeList;
  modal;
  countId;
  constructor(
    dataRestourant: Restourant,
    restorantCalculation: RestorantCalculation,
    container: HTMLElement
  ) {
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
  mainRender(container: HTMLElement) {
    const wrapperInforBlock = this.createElement("div", {
      className: "info-Block",
    });
    const addEmployeeBtn = this.createButton({
      type: "button",
      className: "add-btn",
      innerText: "Добавить нового сотрудника",
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
    wrapperInforBlock.append(
      allSalaryBlock,
      meanSalaryBlock,
      extremumSalaryBlock,
      extremumSalaryPositionBlock,
      dismissedBlock,
      findDepartmentWithoutPositionBlock
    );
    container.append(wrapperInforBlock, wrapperEmployeeCard);
    wrapperEmployeeCard.append(this.employeeList);
  }
  createModal(): HTMLElement {
    const modal = this.createElement("div", {
      className: "modal",
    });
    return modal;
  }
  renderAllSalaryBlock(): HTMLElement {
    const block = this.createElement("div", {
      className: "info-content",
    });
    const title = this.createElement("h2", {
      className: "info-title",
      innerText: "Посчитать зарплаты:",
    });
    const getResult = this.createButton({
      type: "button",
      className: "result-btn",
      innerText: "получить",
    });
    const selectStatus = this.createSelect(
      {
        "1": "работающие",
        "0": "уволенные",
      },
      {
        className: "info-select",
      }
    );
    const outputBlock = this.createElement("p", {
      className: "output",
    });
    block.append(title, getResult, selectStatus, outputBlock);
    getResult.onclick = this.getAllSalaryOnclik.bind(
      this,
      selectStatus,
      outputBlock
    );
    return block;
  }
  renderMeanSalaryBlock(): HTMLElement {
    const block = this.createElement("div", {
      className: "info-content",
    });
    const getResult = this.createButton({
      type: "button",
      className: "result-btn",
      innerText: "получить",
    });
    const selectStatus = this.createSelect(
      {
        "1": "работающие",
        "0": "уволенные",
      },
      {
        className: "info-select",
      }
    );
    const title = this.createElement("h2", {
      className: "info-title",
      innerText: "средняя зарплата по отделам:",
    });
    const outputBlock = this.createElement("p", {
      className: "output",
    });
    getResult.onclick = this.getMeanSalarysOnclik.bind(
      this,
      selectStatus,
      outputBlock
    );
    block.append(title, getResult, selectStatus, outputBlock);
    return block;
  }
  renderExtremumSalaryBlock(): HTMLElement {
    const block = this.createElement("div", {
      className: "info-content",
    });
    const getResult = this.createButton({
      type: "button",
      className: "result-btn",
      innerText: "получить",
    });
    const title = this.createElement("h2", {
      className: "info-title",
      innerText: "Максимальная/минимальная по отделам:",
    });
    const selectExtremum = this.createSelect(
      {
        max: "максимальная",
        min: "минимальная",
      },
      {
        className: "info-select",
      }
    );
    const outputBlock = this.createElement("p", {
      className: "output",
    });
    block.append(title, getResult, selectExtremum, outputBlock);
    getResult.onclick = this.getExtremumSalarysOnclik.bind(
      this,
      selectExtremum,
      outputBlock
    );
    return block;
  }
  renderExtremumSalaryPositionBlock(): HTMLElement {
    const block = this.createElement("div", {
      className: "info-content",
    });
    const title = this.createElement("h2", {
      className: "info-title",
      innerText: "Максимальная/минимальная по позициям:",
    });
    const getResult = this.createButton({
      type: "button",
      className: "result-btn",
      innerText: "получить",
    });
    const selectExtremum = this.createSelect(
      {
        max: "максимальная",
        min: "минимальная",
      },
      {
        className: "info-select",
      }
    );
    const outputBlock = this.createElement("p", {
      className: "output",
    });
    block.append(title, getResult, selectExtremum, outputBlock);
    getResult.onclick = this.getExtremumSalarysByPositionOnclik.bind(
      this,
      selectExtremum,
      outputBlock
    );
    return block;
  }
  renderDismissedBlock(): HTMLElement {
    const block = this.createElement("div", {
      className: "info-content",
    });
    const title = this.createElement("h2", {
      className: "info-title",
      innerText: "количество уволенных:",
    });
    const getResult = this.createButton({
      type: "button",
      className: "result-btn",
      innerText: "получить",
    });
    const outputBlock = this.createElement("p", {
      className: "output",
    });
    block.append(title, getResult, outputBlock);
    getResult.onclick = this.getAmountDismissedEmployeeOnclik.bind(
      this,
      outputBlock
    );
    return block;
  }

  renderFindDepartmentWithoutPositionBlock(): HTMLElement {
    const block = this.createElement("div", {
      className: "info-content",
    });
    const getResult = this.createButton({
      type: "button",
      className: "result-btn",
      innerText: "получить",
    });
    const selectPosition = this.createSelect(this.createPositionList(), {
      className: "info-block",
    });
    const outputBlock = this.createElement("p", {
      className: "output",
    });
    const title = this.createElement("h2", {
      className: "info-title",
      innerText: "Отделы без позиции:",
    });
    block.append(title, getResult, selectPosition, outputBlock);
    getResult.onclick = this.getDepartmentWithoutPositionOnclick.bind(
      this,
      selectPosition,
      outputBlock
    );
    return block;
  }
  getDepartmentWithoutPositionOnclick(
    selectPosition: HTMLSelectElement,
    outputBlock: HTMLElement,
    event: MouseEvent
  ): void {
    event.preventDefault();
    outputBlock.innerHTML = "";
    const position: number = Number(this.getSelectValue(selectPosition));
    outputBlock.innerHTML = String(
      this.calculation.getDepartmentsWithoutPosition(position)
    );
  }
  getAmountDismissedEmployeeOnclik(
    outputBlock: HTMLElement,
    event: MouseEvent
  ): void {
    event.preventDefault();
    outputBlock.innerHTML = "";
    outputBlock.innerHTML = String(
      this.calculation.getAmountDismissedEmployees()
    );
  }
  getExtremumSalarysByPositionOnclik(
    selectExtremum: HTMLSelectElement,
    outputBlock: HTMLElement,
    event: MouseEvent
  ): void {
    outputBlock.innerHTML = "";
    event.preventDefault();
    const extremum: string = this.getSelectValue(selectExtremum);
    const resultSalarys: Record<
      string,
      number
    > = this.calculation.getExtremumSalarysDepartmentsByPosition(extremum);
    for (let department in resultSalarys) {
      outputBlock.innerHTML += `${department}: ${resultSalarys[
        department
      ].toFixed(2)}   `;
    }
  }
  getExtremumSalarysOnclik(
    selectExtremum: HTMLSelectElement,
    outputBlock: HTMLElement,
    event: MouseEvent
  ): void {
    outputBlock.innerHTML = "";
    event.preventDefault();
    const extremum: string = this.getSelectValue(selectExtremum);
    const resultSalarys: Record<
      number,
      number
    > = this.calculation.getExtremumSalarysDepartments(extremum);
    for (let department in resultSalarys) {
      outputBlock.innerHTML += `${department}: ${resultSalarys[
        department
      ].toFixed(2)}   `;
    }
  }
  getMeanSalarysOnclik(
    select: HTMLSelectElement,
    outputBlock: HTMLElement,
    event: MouseEvent
  ): void {
    outputBlock.innerHTML = "";
    event.preventDefault();
    const status: boolean = Boolean(Number(this.getSelectValue(select)));
    const resultSalarys: Record<
      number,
      string
    > = this.calculation.getMeanSalarysDepartments(status);
    for (let department in resultSalarys) {
      outputBlock.innerHTML += `${department}: ${resultSalarys[department]}`;
    }
  }
  getAllSalaryOnclik(
    select: HTMLSelectElement,
    outputBlock: HTMLElement,
    event: MouseEvent
  ): void {
    outputBlock.innerHTML = "";
    event.preventDefault();
    const status: boolean = Boolean(Number(this.getSelectValue(select)));
    const resultSalarys: Record<
      number,
      number
    > = this.calculation.getSalarysDepartments(status);
    for (let department in resultSalarys) {
      outputBlock.innerHTML += `${department}: ${resultSalarys[
        department
      ].toFixed(2)}   `;
    }
  }
  renderEmployeesList(): void {
    this.employeeList.innerHTML = "";
    for (let department of this.departments) {
      for (let employee of department.employeers) {
        this.employeeList.innerHTML += this.createEmployeeCard(
          employee,
          department.id
        );
      }
    }
    this.employeeList.onclick = this.handleClick.bind(this);
  }
  addEmployeeOnclick(event: MouseEvent): void {
    event.preventDefault();
    console.log("fsdfds");
    this.modal.append(this.createForm());
    this.modal.classList.add("active");
  }
  handleClick(event: any) {
    const dataAtribbute: string = event.target.getAttribute("data-action");
    if (dataAtribbute) {
      event.preventDefault();
      const temp: HTMLDivElement = event.target.closest("div.card");
      const idEmployee: number = Number(temp.getAttribute("data-id"));
      const idDepartment: number = Number(temp.getAttribute("data-idDep"));
      const indexDepartment = this.calculation.findIndexDepartment(
        idDepartment
      );
      dataAtribbute === "delete"
        ? this.deleteEmployee(idEmployee, indexDepartment)
        : this.editEmployee(idEmployee, indexDepartment);
    }
  }
  deleteEmployee(idEmployee: number, indexDepartment: number) {
    this.departments[indexDepartment].deleteEmployee(idEmployee);
    this.renderEmployeesList();
  }
  editEmployee(idEmployee: number, indexDepartment: number) {
    const indexEmployee: number = this.departments[
      indexDepartment
    ].findIndexEmployee(idEmployee);
    this.modal.append(
      this.createForm(
        this.departments[indexDepartment].employeers[indexEmployee],
        indexDepartment
      )
    );
    this.modal.classList.add("active");
  }
  createEmployeeCard(dataEmployee: Employee, idDepartment: number): string {
    const indexDepartment: number = this.calculation.findIndexDepartment(
      idDepartment
    );
    const position: number = this.calculation.findIndexPosition(
      dataEmployee.position
    );
    return `<div class="card" data-id="${
      dataEmployee.id
    }" data-idDep="${idDepartment}">
      <p class="cardInfo">Имя: ${dataEmployee.name}</p>
      <p class="cardInfo">Фамилия: ${dataEmployee.surname}</p>
      <p class="cardInfo">Отчество: ${dataEmployee.patronomic}</p>
      <p class="cardInfo info-content">
        <span>Зарплата: ${dataEmployee.salary}</span>
        <span>Статус: ${dataEmployee.status ? "работает" : "уволен"}</span>
        <span>Позиция: ${this.positions[position].title}</span>
        <span>Департамент: ${this.departments[indexDepartment].title}</span>
      </p>
      <div class="wrapperBtnCard">
        <button class="cardBtn" data-action="delete">удалить</button>
        <button class="cardBtn" data-action="edit">редактировать</button>
      </div>
    </div>    `;
  }
  createElement(type: string, props: Record<string, string>): HTMLElement {
    const element = document.createElement(type);
    Object.assign(element, props);
    return element;
  }
  createForm(dataEmployee?: Employee, indexDepartment?: number): HTMLElement {
    const form = this.createElement("form", {
      method: "POST",
      action: "#",
      className: "employeeForm",
    });
    form.innerHTML = `
    <input type="text" name="name" placeholder="имя" value="${
      dataEmployee ? dataEmployee.name : ""
    }" />
    <input
      type="text"
      placeholder="фамилия"
      name="surname"
      value="${dataEmployee ? dataEmployee.surname : ""}"
    />
    <input
      type="text"
      placeholder="отчество"
      name="patronomic"
      value="${dataEmployee ? dataEmployee.patronomic : ""}"
    />
    <input type="number" placeholder="0" name="salary" value="${
      dataEmployee ? dataEmployee.salary : ""
    }"/>
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
  createPositionList(): Record<string, string> {
    const result: Record<string, string> = {};
    for (let position of this.positions) {
      result[position.id] = position.title;
    }
    return result;
  }
  sendData(id: number, event: any) {
    event.preventDefault();
    const form = this.modal.querySelector("form") as HTMLFormElement;
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
  createDapertmentList(): Record<string, string> {
    const departmentList: Record<string, string> = {};
    this.departments.forEach((department) => {
      departmentList[department.id] = department.title;
    });
    return departmentList;
  }
  createButton(props: Record<string, string>): HTMLButtonElement {
    const button = document.createElement("button");
    Object.assign(button, props);
    return button;
  }
  createSelect(
    parameters: Record<string, string>,
    props: Record<string, string>
  ): HTMLSelectElement {
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
  getSelectValue(select: HTMLSelectElement): string {
    let indexSelect = select.options.selectedIndex;
    let valueSelect = select.options[indexSelect].value;
    return valueSelect;
  }
}
const restourant = new Restourant();
restourant.addPsition({
  id: 1,
  title: "руководитель",
});
restourant.addPsition({
  id: 2,
  title: "повар",
});
restourant.addPsition({
  id: 3,
  title: "менеджер",
});
restourant.addPsition({
  id: 4,
  title: "оффициант",
});
restourant.addPsition({
  id: 4,
  title: "уборщик",
});
const first = new Department({
  id: 1,
  title: "северо-западный",
});
const second = new Department({
  id: 2,
  title: "юго-восточный",
});
restourant.addDepartment(first);
restourant.addDepartment(second);
restourant.departments[0].addEmployee(
  new Employee({
    id: 1,
    name: "Вася",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 3000,
    status: true,
  })
);
restourant.departments[0].addEmployee(
  new Employee({
    id: 2,
    name: "Гена",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 2000,
    status: false,
  })
);
restourant.departments[0].addEmployee(
  new Employee({
    id: 3,
    name: "Андрей",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 1000,
    status: true,
  })
);
restourant.departments[1].addEmployee(
  new Employee({
    id: 4,
    name: "John",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 3000,
    status: true,
  })
);
restourant.departments[1].addEmployee(
  new Employee({
    id: 5,
    name: "Вика",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 2000,
    status: true,
  })
);
restourant.departments[1].addEmployee(
  new Employee({
    id: 6,
    name: "Антон",
    surname: "fdsfds",
    patronomic: "secondName1",
    position: 2,
    salary: 1000,
    status: false,
  })
);
const result = new RestorantCalculation(restourant);
const render = new RestoranRender(
  restourant,
  result,
  document.querySelector("#root") as HTMLElement
);
