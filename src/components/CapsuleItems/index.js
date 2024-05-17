import "./index.css";

import { Component } from "react";

class CapsuleItem extends Component {
  state = {
    eachItem: this.props.eachItem,
    forms: this.props.eachItem.available_forms[0],
    formsList: this.props.eachItem.available_forms,
    strengthsList: [],
    selectedStrength: "",
    selectedPackage: "",
    packagesList: [],
    expandStrengths: false,
    expandForms: false,
    expandPackage: false,
    companiesList: [],
    lowestPriceAndAvailability: "",
  };
  //   const eachItem = props.eachItem;

  updatingPackages = (givePackage, givenStrength) => {
    // console.log("e from new function", e);
    const { forms, eachItem } = this.state;
    const { salt_forms_json } = eachItem;
    const result = Object.keys(salt_forms_json);
    const filteredList1 = result.map((each) => {
      if (each === forms) {
        return salt_forms_json[each];
      }
      return "";
    });

    // console.log("filteredlist1", filteredList1);

    for (let each of filteredList1) {
      if (each !== "") {
        for (const [key, value] of Object.entries(each)) {
          //   console.log("key", key, "selected strength", givenStrength);
          if (key === givenStrength) {
            for (const [nkey, nvalue] of Object.entries(value)) {
              if (nkey === givePackage) {
                // console.log("nkey", nkey, "nvalue", nvalue);
                return nvalue;
              }
            }
          }
        }
      }
    }
  };

  returnLowestPrice = (cmpLst) => {
    // const numberOfCompanies = Object.keys(cmpLst).length;
    // console.log("number of compaies", numberOfCompanies);
    const isAvailable = Object.values(cmpLst).every((each) => each === null);
    console.log("is available", isAvailable);
    let priceList = [];
    for (const values of Object.values(cmpLst)) {
      if (values !== null && values !== [] && !isAvailable) {
        // console.log("key", key, "list", values);
        values.forEach((each) => priceList.push(each.selling_price));
      }
    }
    return [priceList, isAvailable];
  };

  componentDidMount() {
    const { eachItem, forms } = this.state;
    const { salt_forms_json } = eachItem;

    var result = Object.keys(salt_forms_json).map((key) => [
      key,
      salt_forms_json[key],
    ]);
    // console.log("result", result);
    result.map((each) => {
      if (each[0] === forms) {
        const strengthKeyArray = Object.keys(each[1]);

        //   finding package list
        const destructedStrength =
          salt_forms_json[`${forms}`][`${strengthKeyArray[0]}`];

        const packagesList = Object.keys(destructedStrength);
        // console.log("kd", packagesList);

        const companiesList = this.updatingPackages(
          packagesList[0],
          strengthKeyArray[0]
        );
        console.log("companies list", companiesList);

        const lowestPriceAndAvailability = this.returnLowestPrice(
          companiesList
        );
        // console.log("lowest price", lowestPriceAndAvailability);
        // console.log("companies list", companiesList);

        this.setState({
          strengthsList: strengthKeyArray,
          selectedStrength: strengthKeyArray[0],
          packagesList,
          selectedPackage: packagesList[0],
          companiesList,
          lowestPriceAndAvailability,
        });
      }
      return "";
    });
  }

  onClickExpandableButton = () => {
    this.setState((prevState) => ({
      expandForms: !prevState.expandForms,
    }));
  };

  onClickStrengthsExpandableButton = () => {
    this.setState((prevState) => ({
      expandStrengths: !prevState.expandStrengths,
    }));
  };

  onClickFormButton = (e) => {
    console.log("e value=", e.target.value);
    const { eachItem, selectedStrength, forms } = this.state;
    const { salt_forms_json } = eachItem;
    const result = Object.keys(salt_forms_json).map((key) => [
      key,
      salt_forms_json[key],
    ]);

    const newFilteredStrengthsList = result.filter((each) =>
      each[0] === e.target.value ? Object.keys(each[1]) : ""
    );

    const destructedStrength =
      salt_forms_json[`${forms}`][`${selectedStrength}`];

    console.log("newly filtered list", destructedStrength);
    this.setState({
      forms: e.target.value,
      strengthsList: Object.keys(newFilteredStrengthsList[0][1]),
      selectedStrength: Object.keys(newFilteredStrengthsList[0][1])[0],
    });
  };

  onClickStrengthButton = (e) => {
    const { eachItem, forms } = this.state;
    const { salt_forms_json } = eachItem;
    const result = Object.keys(salt_forms_json).map((key) => [
      key,
      salt_forms_json[key],
    ]);

    const filteredResult = result.filter((each) => {
      if (each[0] === forms) {
        return each[1];
      }
      return "";
    });

    const newPackagesList = Object.keys(
      filteredResult[0][1][`${e.target.value}`]
    );

    const companiesList = this.updatingPackages(
      newPackagesList[0],
      e.target.value
    );
    const lowestPriceAndAvailability = this.returnLowestPrice(companiesList);

    this.setState({
      selectedStrength: e.target.value,
      packagesList: newPackagesList,
      selectedPackage: newPackagesList[0],
      lowestPriceAndAvailability,
    });
  };

  onClickPackageButton = (e) => {
    const { selectedStrength } = this.state;

    const companiesList = this.updatingPackages(
      e.target.value,
      selectedStrength
    );

    const lowestPriceAndAvailability = this.returnLowestPrice(companiesList);

    this.setState({
      selectedPackage: e.target.value,
      companiesList,
      lowestPriceAndAvailability,
    });
  };

  onClickPageExpandButton = () => {
    this.setState((prevState) => ({
      expandPackage: !prevState.expandPackage,
    }));
  };

  returnStrengthButtons = () => {
    const { strengthsList, expandStrengths, selectedStrength } = this.state;
    if (strengthsList.length > 3) {
      const slicedStrengthsList = strengthsList.slice(0, 3);

      const newStrengthsList = expandStrengths
        ? strengthsList
        : slicedStrengthsList;
      const expandText = expandStrengths ? "hide..." : "more...";
      //   console.log("new strenths list", slicedStrengthsList);
      return (
        <div>
          {newStrengthsList.map((each) => {
            const selectedCss = each === selectedStrength ? "active-css" : "";
            return (
              <button
                key={each}
                type="button"
                onClick={this.onClickStrengthButton}
                value={each}
                className={`${selectedCss}`}
              >
                {each}
              </button>
            );
          })}
          <button
            type="button"
            className="more-hide-button"
            onClick={this.onClickStrengthsExpandableButton}
          >
            {expandText}
          </button>
        </div>
      );
    }
    return (
      <div>
        {strengthsList.map((each) => {
          const selectedCss = each === selectedStrength ? "active-css" : "";

          return (
            <button
              key={each}
              onClick={this.onClickStrengthButton}
              className={`${selectedCss}`}
              value={each}
            >
              {each}
            </button>
          );
        })}
      </div>
    );
  };

  returnStrengths = () => {
    return (
      <div className="items-strengths-container">
        <p>Strength:</p>
        <div className="button-container">{this.returnStrengthButtons()}</div>
      </div>
    );
  };

  returnFormButtons = () => {
    const { formsList, expandForms, forms } = this.state;

    if (formsList.length > 3) {
      const slicedStrengthsList = formsList.slice(0, 3);

      const newFormsList = expandForms ? formsList : slicedStrengthsList;
      const expandText = expandForms ? "hide..." : "more...";

      //   console.log("new strenths list", slicedStrengthsList);

      return (
        <div>
          {newFormsList.map((each) => {
            const selectedButtonCss = forms === each ? "active-css" : "";
            return (
              <button
                key={each}
                className={`${selectedButtonCss}`}
                onClick={this.onClickFormButton}
                value={each}
              >
                {each}
              </button>
            );
          })}
          <button
            type="button"
            className="more-hide-button"
            onClick={this.onClickExpandableButton}
          >
            {expandText}
          </button>
        </div>
      );
    }
    return (
      <div>
        {formsList.map((each) => {
          const selectedButtonCss = each === forms ? "active-css" : "";
          return (
            <button
              key={each}
              onClick={this.onClickFormButton}
              className={`${selectedButtonCss}`}
              value={each}
            >
              {each}
            </button>
          );
        })}
      </div>
    );
  };

  returnForm = () => (
    <div className="items-strengths-container">
      <p>Form:</p>
      <div className="button-container">{this.returnFormButtons()}</div>
    </div>
  );

  returnPackageButtons = () => {
    const { packagesList, expandPackage, selectedPackage } = this.state;
    if (packagesList.length > 3) {
      const slicedStrengthsList = packagesList.slice(0, 3);

      const newStrengthsList = expandPackage
        ? packagesList
        : slicedStrengthsList;
      const expandText = expandPackage ? "hide..." : "more...";
      //   console.log("new strenths list", slicedStrengthsList);
      return (
        <div>
          {newStrengthsList.map((each) => {
            const selectedCss = each === selectedPackage ? "active-css" : "";

            return (
              <button
                key={each}
                type="button"
                value={each}
                className={`${selectedCss}`}
                onClick={this.onClickPackageButton}
              >
                {each}
              </button>
            );
          })}
          <button
            type="button"
            className="more-hide-button"
            onClick={this.onClickPageExpandButton}
          >
            {expandText}
          </button>
        </div>
      );
    }
    return (
      <div>
        {packagesList.map((each) => {
          const selectedCss = each === selectedPackage ? "active-css" : "";
          return (
            <button
              key={each}
              className={`${selectedCss}`}
              onClick={this.onClickPackageButton}
              value={each}
            >
              {each}
            </button>
          );
        })}
      </div>
    );
  };

  returnPackages = () => (
    <div className="items-strengths-container">
      <p>Packages:</p>
      <div>{this.returnPackageButtons()}</div>
    </div>
  );

  returnAvailability = () => {
    const { lowestPriceAndAvailability } = this.state;
    const [priceList, isAvailable] = lowestPriceAndAvailability;

    return (
      <div>
        {!isAvailable ? (
          <div className="available-container">
            <h1>
              From ₹
              {priceList !== undefined && priceList.sort((a, b) => a - b)[0]}
            </h1>
          </div>
        ) : (
          <div className="not-available-container">
            <p>No stores selling this product near you</p>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { eachItem, forms, selectedStrength, selectedPackage } = this.state;
    const { salt } = eachItem;
    return (
      <li key={eachItem.id}>
        <div>
          <div className="forms-containers">{this.returnForm()}</div>
          <div className="forms-containers">{this.returnStrengths()}</div>
          <div className="forms-containers">{this.returnPackages()}</div>
        </div>
        <div className="middle-container">
          <h1>{salt}</h1>

          <p>
            {forms} | {selectedStrength} | {selectedPackage}
          </p>
        </div>
        <div>{this.returnAvailability()}</div>
      </li>
    );
  }
}
export default CapsuleItem;
