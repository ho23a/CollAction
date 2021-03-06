import * as React from "react";
import { IDropDownListItem } from "./DropDown";
import DropDown from "./DropDown";

interface IProjectFilterProps {
  onChange: (projectFilterState: IProjectFilter) => void;
}

export interface IProjectFilter {
  categoryId: string;
  statusId: string;
}

interface IProjectFilterState {
  categories: IDropDownListItem[];
  statusList: IDropDownListItem[];
  categoriesFetching: boolean;
  categoriesFetchError: any;
  filterState: IProjectFilter;
}

export class ProjectFilter extends React.Component<IProjectFilterProps, IProjectFilterState> {

  constructor (props) {
    super(props);

    const statusList: IDropDownListItem[] = [
      { id: "1", name: "Open" },
      { id: "2", name: "Closed" },
      { id: "3", name: "Coming Soon" },
    ];

    this.state = {
      filterState : {
        categoryId: null,
        statusId: statusList[0].id,
      },
      categories: [],
      categoriesFetching: false,
      categoriesFetchError: null,
      statusList,
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  async fetchCategories() {
    try {
      this.setState({ categoriesFetching: true });
      const getCategoriesRequest: Request = new Request("/api/categories");
      const fetchResult: Response = await fetch(getCategoriesRequest);
      const jsonResponse = await fetchResult.json();

      this.setState({
        categoriesFetching: false,
        categories: jsonResponse,
        filterState: {
          ...this.state.filterState,
          categoryId: jsonResponse[0].id.toString(),
        },
      });

      this.props.onChange({
        ...this.state.filterState,
        categoryId: jsonResponse[0].id.toString(),
      });

    } catch (e) {
      console.error(e);
      this.setState({ categoriesFetching: false, categoriesFetchError: e });
    }
  }

  onChange(field: string, value: IDropDownListItem) {
    const toUpdate = {};
    toUpdate[field] = value.id.toString();
    this.setState({
      filterState: {
        ...this.state.filterState,
        ...toUpdate,
      }
    });
    this.props.onChange({
      ...this.state.filterState,
      ...toUpdate,
    });
  }

  render () {
    const categoriesDropDown = <DropDown
      onChange={value => this.onChange("categoryId", value)}
      options={this.state.categories} />;

    const statusDropDown = <DropDown
      onChange={value => this.onChange("statusId", value)}
      options={this.state.statusList} />;

    return (
      <div id="project-filter" className="banner">
        <div className="dotbackground">
          <div className="container">
            <div className="row">

              <div className="col-xs-12">
                <ul>
                  <li className= "project-filter-control  hidden-xs">
                    Show me
                  </li>
                  <li className= "project-filter-control">
                    { categoriesDropDown }
                  </li>
                  <li className= "project-filter-control hidden-xs">
                    projects which are
                  </li>
                  <li className= "project-filter-control">
                    { statusDropDown }
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

}
