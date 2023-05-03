/// <reference types="Cypress" />
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import {
  TEST_IDS,
  IDS,
  DATA_UI_NAME_IDS,
  CSS_IDS,
} from "../support/utils/testids";
let minIndex;
var futureStartDate = Cypress.dayjs().add(35, "days").format("YYYY-MM-DD");
var futureEndDate = Cypress.dayjs().add(45, "days").format("YYYY-MM-DD");

Given("I am on flight bookings page", () => {
  cy.visit("https://flights.booking.com/");
});

Then("the bookings header logo should be displayed", () => {
  cy.get(TEST_IDS.HEADER_LOGO).should("be.visible");
});

Then("I accept cookies", () => {
  cy.get(IDS.ACCEPT_BUTTON).click({ force: true });
});

Then("I should see round trip radio option checked", () => {
  cy.get(IDS.ROUNDTRIP).should("be.checked");
});

Then("I should see button {string}", (name) => {
  cy.contains(name).should("be.visible");
});

When("I click on {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

When("I enter {string} in Airport or city search input filter", (cityName) => {
  cy.get(TEST_IDS.AIRPORT_CITY_SEARCH_INPUT).type(cityName);
});

Then("I should see locations list", () => {
  cy.get(DATA_UI_NAME_IDS.LOCATIONS_LIST).should("be.visible");
});

When("I select {string} from locations list results", (location) => {
  cy.contains(location).click();
});

When("I click on date button", () => {
  cy.get(DATA_UI_NAME_IDS.DATE_BUTTON).click();
});

When("I select future start and end dates from calendar", () => {
  cy.get(`[data-date=${futureStartDate}]`).click();
  cy.get(`[data-date=${futureEndDate}]`).click();
});

When("I click on search submit button", () => {
  cy.get(DATA_UI_NAME_IDS.SEARCH_SUBMIT_BUTTON).click();
});

Then("I should see the flight results", (resultTypes) => {
  resultTypes.raw().forEach((resultType) => {
    for (let i = 0; i < 3; i++) {
      cy.contains(resultType[i]).should("be.visible");
    }
  });
});

Then("I find the flight which has Minimum time at return journey", () => {
  cy.get(TEST_IDS.FLIGHT_CARD_RETURN_DURATION).then(($values) => {
    let returnDurations = $values.toArray().map(($el) => $el.innerText);

    const minReturnFlightTime = returnDurations.reduce((a, b) => {
      return a <= b ? a : b;
    });

    cy.wrap(minReturnFlightTime).as("flightTime");
    minIndex = returnDurations.indexOf(minReturnFlightTime);
    cy.log(minIndex);
  });
});

Then(
  "I should see flight price to be between £{int} to £{int}",
  (minPrice, maxPrice) => {
    cy.get(TEST_IDS.FLIGHT_CARD_MAIN_PRICE)
      .eq(minIndex)
      .find("h2 > div")
      .then(($el) => {
        const price = $el.text().replace("£", "");
        cy.wrap(price).as("flightPrice");
        expect(Number(price)).to.be.within(minPrice, maxPrice);
      });
  }
);

When("I note down flight departure timings", () => {
  cy.get(TEST_IDS.FLIGHT_DEPARTURE_TIME)
    .eq(minIndex)
    .then(($ele) => {
      var deparatureTime = $ele.text();
      cy.log(deparatureTime);
      cy.wrap(deparatureTime).as("actualDepatureTime");
    });

  cy.get(TEST_IDS.FLIGHT_DEPARTURE_RETURN_TIME)
    .eq(minIndex)
    .then(($ele) => {
      var returnDeparatureTime = $ele.text();
      cy.log(returnDeparatureTime);
      cy.wrap(returnDeparatureTime).as("actualRetureDepatureTime");
    });
});

When("I click on see flight button", () => {
  cy.get(TEST_IDS.SEE_FLIGHT).eq(minIndex).click();
});

Then("I should see the flight details sheet overlay", () => {
  cy.get(TEST_IDS.FLIGHT_DETAILS_SHEEET).should("exist");
});

Then(
  "I should see {string} title on flight details sheet",
  (title) => {
    cy.contains(title).should("be.visible");
  }
);

Then("I should see departure date and time on flight details sheet", () => {
  cy.get(TEST_IDS.TIMELINE_LOCATION_DEPARTURE_TIMESTAMP)
    .eq(0)
    .invoke("text")
    .then((deparatureDateTime) => {
      cy.log(deparatureDateTime);
      var actualStartDate = Cypress.dayjs(futureStartDate).format("ddd D MMM");
      cy.log(actualStartDate);
      expect(deparatureDateTime).to.include(actualStartDate);
      cy.get("@actualDepatureTime").then(($actualStartTime) => {
        expect(deparatureDateTime).to.include($actualStartTime);
      });
    });
});

Then("I should see return flight date and time on flight details sheet", () => {
  cy.get(TEST_IDS.TIMELINE_LOCATION_DEPARTURE_TIMESTAMP)
    .eq(1)
    .invoke("text")
    .then((arrivalDateTime) => {
      cy.log(arrivalDateTime);
      var actualEndDate = Cypress.dayjs(futureEndDate).format("ddd D MMM");
      cy.log(actualEndDate);
      expect(arrivalDateTime).to.include(actualEndDate);

      cy.get("@actualRetureDepatureTime").then(($actualReturnTime) => {
        expect(arrivalDateTime).to.include($actualReturnTime);
      });
    });
});

Then("I should see return flight duration on flight details sheet", () => {
  cy.get(TEST_IDS.TIMELINE_FLIGHT_DURATION)
    .eq(1)
    .invoke("text")
    .then((returnFlightDurtion) => {
      cy.log(returnFlightDurtion);
      cy.get("@flightTime").then(($flightT) => {
        cy.log($flightT);
        expect(returnFlightDurtion).to.include($flightT);
      });
    });
});

Then("I should see flight price on flight details sheet", () => {
  cy.get(CSS_IDS.FLIGHT_CONTENT).within(() => {
    cy.get(TEST_IDS.FLIGHT_CARD_MAIN_PRICE)
      .find("h2 > div")
      .invoke("text")
      .then((flightPriceOnSheet) => {
        cy.log(flightPriceOnSheet);
        cy.get("@flightPrice").then(($fP) => {
          cy.log($fP);

          expect(flightPriceOnSheet).to.eq("£" + $fP);
        });
      });
  });
});

When("I click on select button", () => {
  cy.get(TEST_IDS.SELECT_BUTTON).click();
});

Then("I should be taken to {string} page", (summaryCities) => {
  cy.get(TEST_IDS.TRIP_SUMMARY_CITIES)
    .find("h1 > div")
    .should("have.text", summaryCities);
});

Then("I should see main price on London to New York page", () => {
  cy.get(TEST_IDS.FOOTER_MAIN_PRICE)
    .eq(0)
    .then(($ele) => {
      var totalPrice = $ele.text();
      cy.get("@flightPrice").then(($flightPrice) => {
        expect(totalPrice).to.eq("£" + $flightPrice);
      });
    });
});
