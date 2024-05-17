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
    companiesList: [],
  };
  //   const eachItem = props.eachItem;
  componentDidMount() {
    const { strengthsList, eachItem, forms, selectedStrength } = this.state;
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

        const packagesObject = each[1];
        this.setState({
          strengthsList: strengthKeyArray,
          selectedStrength: strengthKeyArray[0],
          packagesList,
          selectedPackage: packagesList[0],
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

    this.setState({
      selectedStrength: e.target.value,
      packagesList: newPackagesList,
    });
  };

  onClickPackageButtons = (e) => {
    const { selectedPackage, selectedStrength, forms, eachItem } = this.state;
    const { salt_forms_json } = eachItem;
    const result = Object.keys(salt_forms_json);
    const filteredList1 = result.map((each) => {
      if (each === forms) {
        return salt_forms_json[each];
      }
      return "";
    });

    // console.log("filteredlist1", filteredList1);
    let requiredData = null;
    for (let each of filteredList1) {
      if (each !== "") {
        for (const [key, value] of Object.entries(each)) {
          //   console.log(key === selectedStrength);
          if (key === selectedStrength) {
            for (const [nkey, nvalue] of Object.entries(value)) {
              if (nkey === e.target.value) {
                console.log("nkey", nkey, "nvalue", nvalue);
                this.setState({
                  selectedPackage: e.target.value,
                  companiesList: nvalue,
                });
              }
            }
          }
        }
      }
    }
  };

  returnStrengthButtons = () => {
    const { strengthsList, expandStrengths } = this.state;
    if (strengthsList.length > 4) {
      const slicedStrengthsList = strengthsList.slice(0, 4);

      const newStrengthsList = expandStrengths
        ? strengthsList
        : slicedStrengthsList;
      const expandText = expandStrengths ? "hide..." : "more...";
      //   console.log("new strenths list", slicedStrengthsList);
      return (
        <div>
          {newStrengthsList.map((each) => (
            <button
              key={each}
              type="button"
              onClick={this.onClickStrengthButton}
              value={each}
            >
              {each}
            </button>
          ))}
          <button type="button" onClick={this.onClickStrengthsExpandableButton}>
            {expandText}
          </button>
        </div>
      );
    }
    return (
      <div>
        {strengthsList.map((each) => (
          <button key={each}>{each}</button>
        ))}
      </div>
    );
  };

  returnStrengths = () => {
    const { eachItem, strengthsList } = this.state;
    return (
      <div className="items-strengths-container">
        <p>Strength:</p>
        <div className="button-container">{this.returnStrengthButtons()}</div>
      </div>
    );
  };

  returnFormButtons = () => {
    const { formsList, expandForms } = this.state;

    if (formsList.length > 4) {
      const slicedStrengthsList = formsList.slice(0, 4);

      const newFormsList = expandForms ? formsList : slicedStrengthsList;
      const expandText = expandForms ? "hide..." : "more...";
      //   console.log("new strenths list", slicedStrengthsList);
      return (
        <div>
          {newFormsList.map((each) => (
            <button key={each} onClick={this.onClickFormButton} value={each}>
              {each}
            </button>
          ))}
          <button type="button" onClick={this.onClickExpandableButton}>
            {expandText}
          </button>
        </div>
      );
    }
    return (
      <div>
        {formsList.map((each) => (
          <button key={each}>{each}</button>
        ))}
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
    const { packagesList } = this.state;
    return packagesList.length !== 0
      ? packagesList.map((each) => (
          <button
            type="button"
            value={each}
            key={each}
            onClick={this.onClickPackageButtons}
          >
            {each}
          </button>
        ))
      : "";
  };

  returnPackages = () => (
    <div className="items-strengths-container">
      <p>Packages:</p>
      <div>{this.returnPackageButtons()}</div>
    </div>
  );

  returnAvailability = () => {
    const { selectedPackage, selectedStrength, forms, eachItem } = this.state;
    // const { salt_forms_json } = eachItem;
    // const result = Object.keys(salt_forms_json);
    // const filteredList1 = result.map((each) => {
    //   if (each === forms) {
    //     return salt_forms_json[each];
    //   }
    //   return "";
    // });

    // // console.log("filteredlist1", filteredList1);
    // let requiredData = null;
    // for (let each of filteredList1) {
    //   if (each !== "") {
    //     for (const [key, value] of Object.entries(each)) {
    //       //   console.log(key === selectedStrength);
    //       if (key === selectedStrength) {
    //         for (const [nkey, nvalue] of Object.entries(value)) {

    //           if (nkey === selectedPackage){
    //         console.log("nkey", nkey, "nvalue", nvalue);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    return <h1>hi</h1>;
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
        <div>
          <h1>{salt}</h1>
          <div>
            <p>
              {forms} | {selectedStrength} | {selectedPackage}
            </p>
          </div>
        </div>
        <div>{this.returnAvailability()}</div>
      </li>
    );
  }
}
export default CapsuleItem;
