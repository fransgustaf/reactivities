import React, {SyntheticEvent} from 'react'
import {Grid} from 'semantic-ui-react'
import {IActivity} from '../../../app/modules/activity'
import ActivityDetails from '../../details/ActivityDetails'
import ActivityForm from '../../form/ActivityForm'
import ActivityList from './ActivityList'

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    setSelectedActivity: (activity: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (e: SyntheticEvent<HTMLButtonElement>, id: string) => void;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    submitting: boolean;
    target: string
}

export const ActivityDashboard: React.FC<IProps> = ({
    activities,
    selectActivity,
    selectedActivity,
    setSelectedActivity,
    createActivity,
    editActivity,
    deleteActivity,
    editMode,
    setEditMode,
    submitting,
    target
}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity} submitting={submitting} target={target}/>
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && (
                    <ActivityDetails activity={selectedActivity} setSelectedActivity={setSelectedActivity} setEditMode={setEditMode} />
                )}
                {editMode && <ActivityForm key={selectedActivity && (selectedActivity.id || 0)} activity={selectedActivity!} createActivity={createActivity} editActivity={editActivity} setEditMode={setEditMode} submitting={submitting}/>}
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashboard