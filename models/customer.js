/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

/** Customer of the restaurant. */

class Customer {
  constructor({ id, firstName, lastName, phone, notes }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.notes = notes;
  }

  /** find all customers. */

  static async all() {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes
       FROM customers
       ORDER BY last_name, first_name`
    );
    // console.log(results.rows)
    return results.rows.map(c => new Customer(c));
  }

  /** get a customer by ID. */

  static async get(id) {
    const results = await db.query(
      `SELECT id, 
         first_name AS "firstName",  
         last_name AS "lastName", 
         phone, 
         notes 
        FROM customers WHERE id = $1`,
      [id]
    );

    const customer = results.rows[0]
    // console.log(customer)

    if (customer === undefined) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(customer);
  }

  /** get all reservations for this customer. */

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  /** save this customer. Can be used when adding customer or updating customer*/

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO customers (first_name, last_name, phone, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.firstName, this.lastName, this.phone, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE customers SET first_name=$1, last_name=$2, phone=$3, notes=$4
             WHERE id=$5`,
        [this.firstName, this.lastName, this.phone, this.notes, this.id]
      );
    }
  }


  /** Returns first and last name joined by a space */

  get fullName() {
    return  `${this.firstName} ${this.lastName}`
  }


  static async search (firstName, lastName){
    if(lastName != undefined){
        const result = await db.query(
        `SELECT id, first_name AS "firstName", last_name AS "lastName", phone, notes
        FROM customers
        WHERE (first_name ILIKE '%${firstName}%' OR first_name ILIKE '%${lastName}%') 
        AND (last_name ILIKE '%${lastName}%' OR last_name ILIKE '%${firstName}%') `
      )
      if (result.rows.length === 0) {
        const err = new Error(`No such customer: ${firstName} ${lastName}`);
        err.status = 404;
        throw err;
      }
      console.log(result.rows)
      return result.rows.map(c => new Customer(c));
    } else {
        const result = await db.query(
        `SELECT id, first_name AS "firstName", last_name AS "lastName", phone, notes
        FROM customers
        WHERE (first_name ILIKE '%${firstName}%' OR last_name ILIKE '%${firstName}%')`
      )
        if (result.rows.length === 0) {
          const err = new Error(`No such customer: ${firstName}`);
          err.status = 404;
          throw err;
        }
        console.log(result.rows)
        return result.rows.map(c => new Customer(c));
    }
  }


  
  // /** get top ten customers with the most reservations. */
  // static async getTopTen(){
  //   const result = await db.query
  // }

  




  // /** get all reservations for this customer. */

  // async getReservations() {
  //   return await Reservation.getReservationsForCustomer(this.id);
  // }

}



module.exports = Customer;
