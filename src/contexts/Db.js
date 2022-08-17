import _ from "lodash";

export default class Db {
  key(k) {
    return k.replace(/^_BC_/, "");
  }

  isKey(k) {
    return /_BC_/.test(k);
  }

  constructor(setStore) {
    this.setStore = setStore;
    this.store = {};
    let store = {};
    const keys = Object.keys(localStorage);
    for (let key of keys) {
      if (this.isKey(key)) {
        store[this.key(key)] = JSON.parse(localStorage.getItem(key));
      }
    }
    this.update(store);
    this.set();
  }

  get(key) {
    return this.store[key];
  }

  set() {
    this.setStore(this.store);
  }

  update(obj) {
    for (let key in obj) {
      this.updateOne(key, obj[key]);
    }
  }

  updateOne(key, val) {
    this.store[key] = val;
    localStorage.setItem("_BC_" + key, JSON.stringify(val));
  }

  updateItem(key, props) {
    let item = _.clone(this.store[key]) || {};
    if (!item) {
      item = {};
    }
    for (let k in props) {
      if (props[k] === null) {
        delete item[k];
      } else {
        item[k] = props[k];
      }
    }
    this.updateOne(key, item);
  }
}
