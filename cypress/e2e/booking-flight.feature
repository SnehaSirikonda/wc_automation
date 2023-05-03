Feature: Flight Booking

  Scenario: Flight booking from London to Newyork
    Given I am on flight bookings page
    And   the bookings header logo should be displayed
    And   I accept cookies
    And   I should see round trip radio option checked
    And   I should see button "London All airports"
    When  I click on "Where to?" button
    And   I enter "Newyork" in Airport or city search input filter
    And   I should see locations list
    When  I select "NYC New York All airports" from locations list results
    And   I click on date button
    And   I select future start and end dates from calendar
    And   I click on search submit button
    And   I should see the flight results
      | Best | Cheapest | Fastest |
    And   I find the flight which has Minimum time at return journey
    And   I should see flight price to be between £400 to £700
    And   I note down flight departure timings
    When  I click on see flight button
    Then  I should see the flight details sheet overlay
    And   I should see "Your flight to New York" title on flight details sheet
    And   I should see departure date and time on flight details sheet
    And   I should see return flight date and time on flight details sheet
    And   I should see return flight duration on flight details sheet
    And   I should see flight price on flight details sheet
    When  I click on select button
    Then  I should be taken to "London to New York" page
    And   I should see main price on London to New York page
